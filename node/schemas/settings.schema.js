const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
    user: { type: mongoose.Schema.ObjectId, ref: "User"},
    chatNotify: { type: Boolean, default: true},
    notifySound: { type: Boolean, default: true},
    callNotify: { type: Boolean, default: true},
    showAvatar: { type: Boolean, default: true},
    showOnlineStatus: { type: Boolean, default: true},
    showBirthday: { type: Boolean, default: true},
    showGender: { type: Boolean, default: true},
    systemSound: { type: Boolean, default: true},
    messageSound: { type: Boolean, default: true}
})

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;