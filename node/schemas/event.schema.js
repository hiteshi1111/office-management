const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    label: {type: String, required: true},
    adminId: {
        type: mongoose.Schema.ObjectId,
        ref: "Admin"
    },
    eventDate: { type: Date, required: true }  // Use Date type here
}, {timestamps: true})

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
