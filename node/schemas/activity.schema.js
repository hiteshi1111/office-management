const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    taskId: { type: mongoose.Schema.ObjectId, ref: "Task"},
    userId: { type: mongoose.Schema.ObjectId, ref: "User"},
    comment: String, 
    isComment: { type: Boolean, default: false }
},{ timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity; 