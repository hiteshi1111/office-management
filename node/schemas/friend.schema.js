const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendSchema = new Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
}, { timestamps: true })

const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;