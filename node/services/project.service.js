const Project = require('../schemas/project.schema');
const Task = require('../schemas/task.schema');
const User = require('../schemas/user.schema');

let project = {};
project.createProject = createProject;
project.getProject = getProject;
project.getProjectAssignee = getProjectAssignee;

async function createProject(title, createdBy) {
    try {
        const newProject = await Project.create({ title, createdBy });
        return newProject;
    } catch (error) {
        throw new Error(error.message);
    }
}


async function getProject() {
    try {
        const project = await Project.find();
        return project;
    } catch (error) {
        console.log('Error sending:', error)
        throw new Error('Error sending message')
    }
}

async function getProjectAssignee(id) {
    try {
        const tasks = await Task.find({ projectId: id });
        if (tasks.length === 0) {
            return [];
        }

        const uniqueAssignees = [];

        for (const task of tasks) {
            if (!task.assignees || task.assignees.length === 0) {
                continue;
            }
            for (const assignee of task.assignees) {
                const assigneeId = assignee.toString();
                if (!uniqueAssignees.some(existingAssignee => existingAssignee._id.toString() === assigneeId)) {
                    const assignDetail = await User.findById(assignee);
                    if (assignDetail) {
                        uniqueAssignees.push(assignDetail);
                    } 
                }
            }
        }
        return uniqueAssignees;
    } catch (error) {
        console.error("Error getting assignee list:", error);
        return Promise.reject("Unable to get assignee list");
    }
}

module.exports = project;