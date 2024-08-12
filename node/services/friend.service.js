const Friend = require("../schemas/friend.schema");
const Conversation = require("../schemas/conversation.schema");
const MessageRequest = require("../schemas/messageRequest.schema");

let service = {};

service.removeFriend = removeFriend;
service.blockFriend = blockFriend;

async function removeFriend(convoId, body) {
    try {
        await Friend.findOneAndDelete({ conversationId: convoId });
        await MessageRequest.findOneAndUpdate({ conversationId: convoId, isAccepted: false, isRead: false, from : body.blockedBy });
        return true;
    } catch (error) {
        console.log("Error sending message request", error);
        return Promise.reject("Error sending message request");
    }
}

async function blockFriend(id, body) {
    try {
        const conversation = await Conversation.findById(id);
        if (!conversation) {
            return Promise.reject('Conversation not found');
        }

        const blockedByIndex = conversation.blockedBy.indexOf(body.blockedBy);

        if (blockedByIndex === -1) {
            conversation.blockedBy.push(body.blockedBy);
        } else {
            conversation.blockedBy.splice(blockedByIndex, 1);
        }

        const updated = await conversation.save();
        return updated.blockedBy;
    } catch (error) {
        console.log("Error updating conversation", error);
        return Promise.reject(error);
    }
}

module.exports = service;