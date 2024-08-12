const mongoose = require('mongoose')
const Schema = mongoose.Schema

const departmentSchema = new Schema({
    title: { type: String, required: true },
    adminId:{ type: mongoose.Schema.ObjectId, ref:"Admin" },
    isActive: { type:Boolean, default:false },
},{timestamps:true})

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department