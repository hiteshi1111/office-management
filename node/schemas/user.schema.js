const mongoose = require('mongoose')
const Schema = mongoose.Schema;      

const userSchema = new Schema({
    fullName:{ type: String, required: true },
    email:{ type: String, required: true },
    password:{ type: String, required: true },
    avatar: { type: String, default: "https://res.cloudinary.com/dixpqlscx/image/upload/v1716183744/vecteezy_account-avatar-user-business-flat-line-filled-icon-vector_13223732_ecraj9.jpg" },
    birthday: Date,
    gender: { type:String, enum: ["male", "female", "prefer not to say"], default: "prefer not to say" },
    mobile: String,
    companyTitle: { type: String},
    companyAddress: { type: String },
    companyEmail: String,
    companyMobile: String,
    adminId:{ type:mongoose.Schema.ObjectId, ref:'User' },
    role:{ type:mongoose.Schema.ObjectId, ref:'Role', required: true },
    isActive: { type: Boolean, default: false }
},{timestamps:true})

const User = mongoose.model('User', userSchema);

module.exports = User;