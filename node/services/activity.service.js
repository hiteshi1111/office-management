const Activity = require('../schemas/activity.schema');
const Users = require('../schemas/user.schema')
let service = {};

service.createComment = createComment;
service.getComments = getComments;
service.createActivity = createActivity;

// CREATES COMMENT ON TASK
async function createComment(id, body) {
    const data = {
        taskId: id,
        userId: body.userId,
        comment: body.comment, 
        isComment: true
    }
    try {
        const newActivity = new Activity(data);
        const activity = await newActivity.save();
        return activity;
    } catch (error) {
        return Promise.reject(error);
    }
}

// FETCHES ALL ACTIVITIES OF SINGLE TASK
async function getComments(id) {
    try {
        const activity = await Activity.find({taskId: id}).populate('userId');
        return activity;
    } catch (error) {
        return Promise.reject(error);
    }
}

// CREATES COMMENT ON TASK
async function createActivity(id, comment) {
    const data = {
        taskId: id,
        comment: comment, 
        isComment: false
    }
    try {
        const newActivity = new Activity(data);
        const activity = await newActivity.save();
        return activity;
    } catch (error) {
        return Promise.reject(error);
    }
}

module.exports = service;