const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    conversationId: { type: mongoose.Schema.ObjectId, ref: "Conversation" },
    from: { type: mongoose.Schema.ObjectId, ref: "User" },
    message: String,
    image: String,
    sticker: String,
    isRead: { type: Boolean, default: false },
    reactions: [
        {
            emoji: { type: String, required: true },
            user: { type: mongoose.Schema.ObjectId, ref: "User", required: true }
        }
    ],
    isRemoved: { type: Boolean, default: false },
    forwardedFrom: { type: mongoose.Schema.ObjectId, ref: "Message" },
    replyTo: { type: mongoose.Schema.ObjectId, ref: "Message" },
    readReceipts: [
        {
            user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
            readAt: { type: Date, default: Date.now }
        }
    ],
    deletedBy: { type:String , default: ''},
    sticker: String,
    isEdited: { type: Boolean, default: false}
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;