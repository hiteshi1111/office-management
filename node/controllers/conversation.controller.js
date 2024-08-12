const express = require('express');
const router = express.Router();
const ConversationService = require("../services/conversation.service");

//CREATES CONVERSATION
router.post("/", function (req, res) {
    ConversationService.createConversation(req.body).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

//FETCHES CONVERSATION LIST
router.get("/:id", function (req, res) {
    ConversationService.getConversations(req.params.id).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

module.exports = router;