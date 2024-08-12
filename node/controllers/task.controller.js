const express = require('express');
const router = express.Router();
const TaskService = require('../services/task.service');
const ActivityService = require('../services/activity.service');
const User = require('../schemas/user.schema');
const Task = require('../schemas/task.schema');
const Milestone = require('../schemas/milestone.schema');

router.post('/', (req, res) => {
    TaskService.createTask(req.body).then(response => {
        res.status(200).send(response);
    }).catch(error => {
        console.error("Error creating task:", error);
        res.status(500).send("Error creating task");
    });
});

router.get('/:id', async (req, res) => {
    try {
        let allTasks = [];
        const milestones = await Milestone.find({ projectId: req.params.id });
        if (milestones.length > 0) {
            for (let i = 0; i < milestones.length; i++) {
                const response = await TaskService.getTasks(milestones[i]._id)
                allTasks.push({
                    _id: milestones[i]._id,
                    title: milestones[i].title,
                    color: milestones[i].color,
                    projectId: milestones[i].projectId,
                    createdBy: milestones[i].createdBy,
                    createdAt: milestones[i].createdAt,
                    tasks: response
                })
            }
            res.status(200).send(allTasks);
        } else {
            res.status(200).send(allTasks);
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await TaskService.deleteTask(req.params.id)
        res.status(200).send("OK");
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

router.put('/assignee/:id', async (req, res) => {
    try {
        await TaskService.updateTaskAssignee(req.params.id, req.body.assignee).then((response) => {
            res.status(200).send(response)
        })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.put('/:id', async (req, res) => {
    try {
        const updatedData = await TaskService.updateTask(req.params.id, req.body);
        if (req.body.milestoneId) {
            const user = await User.findOne({ _id: req.body.updatedBy });
            const comment = `<b>${user?.fullName}</b> changed the status to <b>${updatedData.milestoneId.title}</b>`
            await ActivityService.createActivity(req.params.id, comment);
        }
        res.status(200).send(updatedData)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).send("OK")
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.get("/getAssignee/:id", function (req, res) {
    TaskService.getAssigneesList(req.params.id).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

module.exports = router;