const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title : { type : String, required : true },
    createdBy : {  type : mongoose.Schema.Types.ObjectId, ref : 'User' }
},{timestamps:true})

const Project = mongoose.model('Project',projectSchema);

module.exports = Project;