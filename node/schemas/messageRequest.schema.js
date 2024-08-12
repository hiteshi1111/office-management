const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const messageRequestSchema = new Schema({
    conversationId: { type:mongoose.Schema.ObjectId, ref: "Conversation" },
    from: { type:mongoose.Schema.ObjectId, ref: "User" },
    isAccepted: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
},{ timestamps:true })

const MessageRequest = mongoose.model('MessageRequest', messageRequestSchema);

module.exports = MessageRequest;