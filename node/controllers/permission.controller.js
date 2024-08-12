const express = require('express');
const router = express.Router();
const Permission = require("../schemas/permission.schema");

router.get("/:id", async function (req, res) {
    try{
        const permissions = await Permission.findOne({userId: req.params.id});
        res.status(200).send(permissions);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
});

router.post("/:id", async function (req, res) {
    try{
        const permissions = await Permission.findOneAndUpdate({userId: req.params.id}, req.body, {new: true});
        res.status(200).send(permissions);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
});

module.exports = router;