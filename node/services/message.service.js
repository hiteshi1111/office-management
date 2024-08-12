const Message = require("../schemas/message.schema");
const Conversation = require("../schemas/conversation.schema");
const MessageRequest = require("../services/messageRequest.service");
const ConversationService = require("../services/conversation.service");

let service = {};
service.sendMessage = sendMessage;
service.getMessages = getMessages;
service.seenMessage = seenMessage;
service.addReaction = addReaction;
service.deleteMessages = deleteMessages;
service.seenSingleMessage = seenSingleMessage;
service.sendNotes = sendNotes;
service.getNotes = getNotes;

// SENDS NOTES
async function sendNotes(body) {
    try {
        const ifExists = await Conversation.findOne({
            participants: { $size: 1, $all: [body.from] }
        });
                
        if (ifExists) {
            body.conversationId= ifExists?._id;

            const newMessage = new Message(body);
            await newMessage.save();
            const messageDetail = await Message.findById(newMessage._id).populate({
                path: "forwardedFrom",
                populate: {
                    path: "from"
                }
            }).populate({
                path: "replyTo",
                populate: {
                    path: "from"
                }
            })

            const updatedMessageDetail = messageDetail.toObject();
            updatedMessageDetail.to = body.to;
            return { message: updatedMessageDetail, convoId: ifExists._id };
        } else {
            const convoId = await ConversationService.createNotesConversation(body);
            body.conversationId = convoId;
            const newMessage = new Message(body);
            await newMessage.save();
            const updatedNewMessage = newMessage.toObject();
            updatedNewMessage.to = body.to;
            return { message: updatedNewMessage, convoId: convoId };
        }
    } catch (error) {
        console.log("Error sending message", error);
        return Promise.reject("Error sending message!");
    }
}

// SENDS MESSAGE
async function sendMessage(body) {
    try {
        const ifExists = await Conversation.findOne({
            participants: { $all: [body.from, body.to] }
        });
        if (ifExists) {
            const newMessage = new Message(body);
            await newMessage.save();
            const messageDetail = await Message.findById(newMessage._id).populate({
                path: "forwardedFrom",
                populate: {
                    path: "from"
                }
            }).populate({
                path: "replyTo",
                populate: {
                    path: "from"
                }
            })
            const updatedMessageDetail = messageDetail.toObject();
            updatedMessageDetail.to = body.to;
            return { message: updatedMessageDetail, convoId: ifExists._id };
        } else {
            const convoId = await ConversationService.createConversation(body);
            await MessageRequest.sendMessageRequest({ conversationId: convoId, from: body.from });
            body.conversationId = convoId;
            const newMessage = new Message(body);
            await newMessage.save();
            const updatedNewMessage = newMessage.toObject();
            updatedNewMessage.to = body.to;
            return { message: updatedNewMessage, convoId: convoId };
        }
    } catch (error) {
        console.log("Error sending message", error);
        return Promise.reject("Error sending message!");
    }
}

// FETCHES ALL MESSAGES
async function getNotes(id) {
    try {
        const messages = await Message.find({
            conversationId: id,
            participants: { $size: 1 }
        }).populate({
            path: "forwardedFrom",
            populate: {
                path: "from"
            }
        }).populate({
            path: "replyTo",
            populate: {
                path: "from"
            }
        })
        return messages;
    } catch (error) {
        console.log("Error fetching message", error);
        return Promise.reject(error);
    }
}

// FETCHES ALL MESSAGES
async function getMessages(id) {
    try {
        const messages = await Message.find({
            conversationId: id
        }).populate({
            path: "reactions",
            populate: {
                path: "user"
            }
        }).populate({
            path: "forwardedFrom",
            populate: {
                path: "from"
            }
        }).populate({
            path: "replyTo",
            populate: {
                path: "from"
            }
        })
        // .sort({ createdAt: -1 }) // Sort by creation date in descending order
        // .limit(10);            // Limit the results to `limit` messages

        return messages;
    } catch (error) {
        console.log("Error fetching message", error);
        return Promise.reject(error);
    }
}

// SEEN UNSEEN MESSAGE
async function seenMessage(id) {
    try {
        const message = await Message.updateMany(
            {
                conversationId: id
            },
            {
                $set: { isRead: true }
            }
        )
        return message;
    } catch (error) {
        console.log('Error seeing message:', error)
        return Promise.reject('Error seeing message')
    }
}

// SEEN UNSEEN SINGLE MESSAGE
async function seenSingleMessage(id) {
    try {
        const message = await Message.findOneAndUpdate(
            {
                _id: id
            },
            {
                $set: { isRead: true }
            }
        )
        return message;
    } catch (error) {
        console.log('Error seeing message:', error)
        return Promise.reject('Error seeing message')
    }
}

// ADDS REACTION TO MESSAGE
// async function addReaction(id, body) {
//     try {
//         console.log("body", body)
//         const data = await Message.findOneAndUpdate(
//             { _id: id },
//             { $push: { reactions: { emoji: body.emoji, user: body.userId } } },
//             { new: true }
//         )
//         console.log("data", data)
//         return data
//     } catch (error) {
//         console.log(error, "error updation message reaction")
//         return Promise.reject({ error: "Error updating message reaction" })
//     }
// }

async function addReaction(id, body) {
    try {
        const message = await Message.findById(id)
        if (message) {
            const existingReactionIndex = message.reactions.findIndex(
                reaction => reaction.user.toString() === body.userId && reaction.emoji === body.emoji
            );
            if (existingReactionIndex !== -1) {
                message.reactions.splice(existingReactionIndex, 1);
            }
            else {
                message.reactions.unshift({ emoji: body.emoji, user: body.userId });
            }
            const updatedMessage = await message.save();
            return updatedMessage;
        }
    } catch (error) {
        console.log(error, "error updation message reaction")
        return Promise.reject({ error: "Error updating message reaction" })
    }
}

async function deleteMessages(id, body) {
    try {
        const deletedMessages = await Message.find({
            conversationId: id,
            deletedBy: { $ne: "" }
        })

        const filteredDeletedMessages = deletedMessages.filter(message => {
            return message.deletedBy !== body.deletedBy;
        });

        const undeletedMessages = await Message.find({
            conversationId: id,
            deletedBy: ""
        });

        if (undeletedMessages.length > 0) {
            await Message.updateMany(
                {
                    _id: { $in: undeletedMessages.map(message => message._id) }
                },
                {
                    $set: { deletedBy: body.deletedBy }
                }
            );
        }

        if (filteredDeletedMessages.length > 0) {
            await Message.deleteMany(
                {
                    _id: { $in: filteredDeletedMessages.map(message => message._id) }
                }
            );
        }
        return {
            filteredDeletedMessages: filteredDeletedMessages,
            deletedMessages: deletedMessages
        };
    } catch (error) {
        console.log("Error deleting chat", error);
        return Promise.reject("Error deleting chat");
    }

}

module.exports = service;