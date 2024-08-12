const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    title: { type: String, required: true },
    departmentId: { 
        type: mongoose.Schema.ObjectId,
        ref: "Department" 
    },
    isActive: {type: Boolean, required: false}
}, { timestamps: true })

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;