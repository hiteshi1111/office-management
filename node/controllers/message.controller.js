const express = require('express')
const router = express.Router();
const MessageService = require('../services/message.service')
const Message = require('../schemas/message.schema');

// SENDS NOTES
router.post("/notes", function (req, res) {
    MessageService.sendNotes(req.body).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(500).send(error);
    })
})

// SENDS MESSAGE
router.post("/", function (req, res) {
    MessageService.sendMessage(req.body).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(500).send(error);
    })
})

// FETCHES NOTES OF A SINGLE PERSON
router.get("/notes/:id", function (req, res) {
    MessageService.getNotes(req.params.id).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(500).send(error);
    })
})

// FETCHES MESSAGES OF A SINGLE PERSON
router.get("/:id", function (req, res) {
    MessageService.getMessages(req.params.id).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(500).send(error);
    })
})

// UPDATE MESSAGE STATUS TO SEEN
router.put('/seen/:id', function (req, res) {
    MessageService.seenMessage(req.params.id).then(response => {
        res.status(200).send(response)
    }).catch(error => {
        res.status(400).send(error)
    })
})

// UPDATE SINGLE MESSAGE STATUS TO SEEN
router.put('/seenmsg/:id', function (req, res) {
    MessageService.seenSingleMessage(req.params.id).then(response => {
        res.status(200).send(response)
    }).catch(error => {
        res.status(400).send(error)
    })
})

// ADD REACTION TO THE MESSAGES
router.put("/reaction/:id", function(req,res){
    MessageService.addReaction(req.params.id, req.body).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

// REMOVES MESSAGE
router.put("/remove/:id", async function (req, res) {
    try {
        await Message.findOneAndUpdate({ _id: req.params.id }, { isRemoved: true });
        res.status(200).send("OK");
    } catch (err) {
        console.log("Error retrieving admin employees", err);
        res.status(500).send(err)
    }
})

// Updates MESSAGE
router.put("/:id", async function (req, res) {
    try {
        await Message.findOneAndUpdate({ _id: req.params.id }, req.body);
        res.status(200).send("OK");
    } catch (err) {
        console.log("Error retrieving admin employees", err);
        res.status(500).send(err)
    }
})

// DELETE MESSAGE FROM ONE SIDE
router.delete("/deletechat/:id", function (req, res) {
    MessageService.deleteMessages(req.params.id, req.body).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
})

module.exports = router;