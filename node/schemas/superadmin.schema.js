const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const superAdminSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type:mongoose.Schema.ObjectId, ref:'Role', required: true },
}, { timestamps: true })

const SuperAdmin = mongoose.model('superadmin', superAdminSchema);

module.exports = SuperAdmin;