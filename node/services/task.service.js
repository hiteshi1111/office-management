const Task = require('../schemas/task.schema');
const Conversation = require('../schemas/conversation.schema');
const User = require('../schemas/user.schema');

let services = {};
services.createTask = createTask;
services.getTasks = getTasks;
services.deleteTask = deleteTask;
services.updateTaskAssignee = updateTaskAssignee;
services.updateTask = updateTask;
services.getAssigneesList = getAssigneesList;

async function createTask(body) {
    try {
        const newTask = new Task(body);
        await newTask.save();
        const assignees = newTask.assignees
        return assignees;
    } catch (error) {
        return Promise.reject(error);
    }
}

async function getTasks(id) {
    try {
        const tasks = await Task.find({ milestoneId: id }).populate('assignees')
        return tasks;
    } catch (error) {
        return Promise.reject(error);
    }
}

async function deleteTask(id) {
    try {
        await Task.deleteOne({ _id: id })
        return true;
    } catch (error) {
        return Promise.reject(error);
    }
}

async function updateTaskAssignee(id, assignee) {
    try {
        const task = await Task.findOne({ _id: id });

        if (!task) {
            throw new Error("Task not found");
        }

        const updateOperation = task.assignees.includes(assignee)
            ? { $pull: { assignees: assignee } }
            : { $push: { assignees: assignee } };

        const updatedTask = await Task.findOneAndUpdate(
            { _id: id },
            updateOperation,
            { new: true }
        ).populate('assignees');

        return updatedTask;
    } catch (error) {
        return Promise.reject(error);
    }
}

async function updateTask(id, body) {
    try {
        const data = await Task.findOneAndUpdate({ _id: id }, body, { new: true }).populate("milestoneId").populate('assignees');
        return data;
    } catch (error) {
        return Promise.reject(error);
    }
}

async function getAssigneesList(id) {
    try {
        const conversations = await Conversation.find({
            participants: { $in: [id] }
        }).populate('participants');

        const filteredConversations = conversations.map(conversation => {
            const filteredParticipants = conversation.participants.filter(participant => {
                return participant._id.toString() !== id;
            });
            return {
                ...conversation.toObject(),
                participants: filteredParticipants
            };
        });
        const user = await User.findById(id)
        const result = [{ participants: [user] }, ...filteredConversations];
        return result;
    } catch (error) {
        console.log("Error fetching conversation", error);
        return Promise.reject("Error fetching conversation");
    }
}

module.exports = services;