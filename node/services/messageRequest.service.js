const mongoose = require('mongoose');
const MessageRequest = require("../schemas/messageRequest.schema");

let service = {};

service.sendMessageRequest = sendMessageRequest;
service.formatRequestData = formatRequestData;
service.readRequests = readRequests;

async function readRequests(ids) {
    try {
        const objectIds = ids.length > 0 && ids.map(id => new mongoose.Types.ObjectId(id));
        await MessageRequest.updateMany(
            { _id: { $in: objectIds } },
            { $set: { isRead: true } }
        );
        return true;
    } catch (error) {
        console.log("Error updating message request", error);
        return Promise.reject("Error sending message request");
    }
}

async function sendMessageRequest(body) {
    try {
        const ifExists = await MessageRequest.findOne({ conversationId: body.convoId });
        if (ifExists) {
            return true;
        } else {
            const newRequest = new MessageRequest(body);
            await newRequest.save();
            return true;
        }
    } catch (error) {
        console.log("Error sending message request", error);
        return Promise.reject("Error sending message request");
    }
}

function formatRequestData(dataArray, me) {
    const structuredData = dataArray.map(data => {
        const participants = data.conversationId.participants;
        const blockedBy = data.conversationId.blockedBy || [];
        const toParticipant = participants.find(participant => participant._id !== data.from._id);
        return {
            _id: data._id,
            conversationId: data.conversationId._id,
            to: {
                _id: toParticipant._id,
                avatar: toParticipant.avatar,
                fullName: toParticipant.fullName
            },
            from: {
                _id: data.from._id,
                avatar: data.from.avatar,
                fullName: data.from.fullName
            },
            isAccepted: data.isAccepted,
            blockedBy: blockedBy,
            isRead: data.isRead
        };
    });
    const nonBlockedData = structuredData.filter(data => data.blockedBy.length === 0);

    const specificData = nonBlockedData.filter(index => {
        return index.to._id.toString() === me || index.from._id.toString() === me;
    })
    const filteredData = specificData.length > 0 && specificData.filter(index => {
        return (index.from._id === me && index.isAccepted) || (index.to._id == me && !index.isAccepted)
    })
    return filteredData;
}

module.exports = service;