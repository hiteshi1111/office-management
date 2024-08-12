const express = require('express');
const router = express.Router();
const Project = require('../schemas/project.schema');
const Milestone = require('../schemas/milestone.schema');
const Task = require('../schemas/task.schema');
const ProjectService = require('../services/project.service');

// CREATES PROJECT
router.post('/:id', async (req, res) => {
    try {
        const ifExists = await Project.findOne({ title: req.body.title.toLowerCase(), createdBy: req.params.id });
        if (ifExists) {
            res.status(500).send("Title already exists!");
        } else {
            let data = {
                title: req.body.title.toLowerCase(),
                createdBy: req.params.id
            }
            let project = new Project(data);
            project.save();
            res.status(200).send("OK");
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

// GETS ADMIN PROJECT DATA
router.get('/admin/:id', async (req, res) => {
    try {
        const projects = await Project.find({ createdBy: req.params.id });
        res.status(200).send(projects);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});


router.get('/:id', async (req, res) => {
    try {
        const tasks = await Task.find({ assignees: { $in: [req.params.id] } });
        // Extract unique project IDs from tasks
        const projectIds = [...new Set(tasks.map(task => task.projectId))];
        const myProjects = await Project.find({ _id: { $in: projectIds } });
        res.status(200).send(myProjects);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// UPDATES PROJECT DATA
router.put('/:id', async (req, res) => {
    try {
        await Project.findByIdAndUpdate(req.params.id, req.body, { upsert: true });
        res.status(200).send("OK");
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
})

// DELETES SINGLE PROJECT
router.delete('/:id', async (req, res) => {
    try {
        await Task.deleteMany({ projectId: req.params.id });
        await Milestone.deleteMany({ projectId: req.params.id });
        await Project.deleteOne({ _id: req.params.id });
        res.status(200).send("OK");
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
})

// GET SINGLE PROJECT ALL ASSIGNEES
router.get('/assignee/:id', async (req, res) => {
    try {
        ProjectService.getProjectAssignee(req.params.id)
            .then(result => {
                res.status(200).send(result);
            }).catch(error => {
                res.status(400).send(error);
            })

    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
})

module.exports = router;