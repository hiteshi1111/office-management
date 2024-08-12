const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    projectId :{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    milestoneId :{ type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    assignedAt : { type: Date, default: Date.now },
    createdBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dueDate: Date,
    pullRequest: String,
    previewLink: String
},{ timestamps:true });

const Task = mongoose.model('Task', taskSchema );

module.exports = Task;