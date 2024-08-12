const express = require('express');
const router = express.Router();
const ActivityService = require('../services/activity.service');
const Activity = require('../schemas/activity.schema');

//ADDS NEW COMMENT
router.post('/:id', async (req, res) => {
    try{
        const response = await ActivityService.createComment(req.params.id, req.body)
        res.status(200).send(response);
    }catch(err){ 
        console.log(err)
        res.status(500).send(err);
    }
});

//FETCHES ALL COMMENTS OF SINGLE TASK
router.get('/:id', async (req, res) => {
    try{
        const response = await ActivityService.getComments(req.params.id)
        res.status(200).send(response);
    }catch(err){ 
        console.log(err)
        res.status(500).send(err);
    }
});

//ADDS NEW ACTIVITY
router.post('/add/:id', async (req, res) => {
    try{
        const response = await ActivityService.createActivity(req.params.id, req.body)
        res.status(200).send(response);
    }catch(err){ 
        console.log(err)
        res.status(500).send(err);
    }
});

router.delete('/:id', async (req,res) => {
    try {
        await Activity.findByIdAndDelete(req.params.id);
        res.status(200).send("OK")
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

module.exports = router;