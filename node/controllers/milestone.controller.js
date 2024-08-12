const express = require('express');
const router = express.Router();
const Milestone = require('../schemas/milestone.schema');
const Task = require('../schemas/task.schema');

//ADDS NEW MILESTONE
router.post('/:id', async (req, res) => {
    try{
        const ifExists = await Milestone.findOne({title: req.body.title.toLowerCase(), projectId: req.body.projectId});
        if (ifExists){
            res.status(500).send("Title already exists!");
        }else{
            let data = {
                title: req.body.title.toLowerCase(),
                color: req.body.color,
                projectId: req.body.projectId,
                createdBy : req.params.id
            }
            let milestone = new Milestone(data);
            milestone.save();
            res.status(200).send("OK");
        }
    }catch(err){
        console.log(err)
        res.status(500).send(err);
    }
});

//GETS ALL MILESTONES THROUGH SINGLE PROJECT ID
router.get('/:id', async (req, res) => {
    try {
        const milestones = await Milestone.find({projectId: req.params.id});
        res.status(200).send(milestones);
    }catch(err){
        console.log(err)
        res.status(500).send(err);
    }
})

//DELETES MILESTONE AND ITS TASKS
router.delete('/:id', async (req, res) => {
    try {
        await Milestone.deleteOne({ _id: req.params.id });
        await Task.deleteMany({ milestoneId: req.params.id });
        res.status(200).send("OK");
    }catch(err){
        console.log(err)
        res.status(500).send(err);
    }
})

//UPDATES MILESTONE     
router.put('/:id', async (req, res) => {
    try {
        const milestones = await Milestone.findOneAndUpdate({_id: req.params.id}, req.body );
        res.status(200).send(milestones);
    }catch(err){
        console.log(err)
        res.status(500).send(err);
    }
});

//UPDATES MILESTONE     
router.put('/:id', async (req, res) => {
    try {
        const milestones = await Milestone.findOneAndUpdate({_id: req.params.id}, req.body );
        res.status(200).send(milestones);
    }catch(err){
        console.log(err)
        res.status(500).send(err);
    }
});

module.exports = router;