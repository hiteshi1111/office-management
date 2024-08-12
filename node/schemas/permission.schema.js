const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
    userId: { type:mongoose.Schema.ObjectId, ref: "User" },
    sendMessageRequest: { type: Boolean, default: true },
    addEmployee: { type:Boolean, default:false },
    addEvent: { type:Boolean, default:false },
    addTasks: { type:Boolean, default:false },
    addProject: { type:Boolean, default:false },
    addMilestone: { type:Boolean, default:false },
    updateTaskStatus: { type:Boolean, default:false },
    updateProfile: { type:Boolean, default:false },
},{timestamps:true})

const Permission = mongoose.model('Permission',permissionSchema);

module.exports = Permission;