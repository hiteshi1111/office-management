const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const milestoneSchema = new Schema({
    title :{ type : String, required : true },
    color: String,
    projectId: { type : mongoose.Schema.Types.ObjectId, ref : 'User' },
    createdBy : { type : mongoose.Schema.Types.ObjectId, ref : 'User' }
}, { timestamps: true })

const Milestone = mongoose.model('Milestone', milestoneSchema);

module.exports = Milestone;