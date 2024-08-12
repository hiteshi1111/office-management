const Conversation = require("../schemas/conversation.schema");
const MessageRequest = require("../schemas/messageRequest.schema");
const SettingsService = require("../services/settings.service");

let service = {}
service.createConversation = createConversation;
service.getConversations = getConversations;
service.createNotesConversation = createNotesConversation;

//CREATES NEW CONVERSATION
async function createConversation(body) {
    try {
        const data = {
            participants: [
                body.to,
                body.from
            ]
        }
        const newConversation = new Conversation(data);
        const conversation = await newConversation.save();
        return conversation._id;
    } catch (error) {
        console.log("Error creating conversation", error);
        return Promise.reject({ error: "Error creating conversation" });
    }
}

//CREATES NEW NOTES CONVERSATION
async function createNotesConversation(body) {
    try {
        const data = {
            participants: [
                body.from
            ]
        }
        const newConversation = new Conversation(data);
        const conversation = await newConversation.save();
        return conversation._id;
    } catch (error) {
        console.log("Error creating conversation", error);
        return Promise.reject({ error: "Error creating conversation" });
    }
}

//FETCHES USER CONVERSATIONS
async function getConversations(id) {
    try {
        const conversations = await Conversation.find({
            participants: { $size: 2, $in: [id] }
        }).populate({
            path: 'participants',
            populate: {
                path: 'role',
                model: 'Role'
            }
        });

        const filteredConversations = [];
        for (const conversation of conversations) {
            const filteredParticipants = conversation.participants.filter(participant => {
                return participant._id.toString() !== id;
            });
            const settings = filteredParticipants.length === 1 
                ?  await SettingsService.updateSettings(filteredParticipants[0]._id)
                : null
            const messageRequest = await MessageRequest.findOne({ conversationId: conversation._id }).select('-user');

            filteredConversations.push({
                ...conversation.toObject(),
                participants: filteredParticipants,
                isFriend: messageRequest?.isAccepted || false,
                settings: settings
            });
        }

        return filteredConversations;
    } catch (error) {
        console.log("Error fetching conversations", error);
        return Promise.reject("Error fetching conversations");
    }
};

module.exports = service;