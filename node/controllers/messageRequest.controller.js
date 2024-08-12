const express = require('express');
const router = express.Router();
const RequestService = require("../services/messageRequest.service");
const MessageRequest = require("../schemas/messageRequest.schema");
const FriendList = require("../schemas/friend.schema");
const Conversation = require("../schemas/conversation.schema");

//SENDS MESSAGE REQUEST
router.post("/", function (req, res) {
    RequestService.sendMessageRequest(req.body).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post("/read", function (req, res) {
    RequestService.readRequests(req.body).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

//FETCHES MESSAGE REQUESTS
router.get("/", async function (req, res) {
    const me = req.query.me;
    const adminId = req.query.adminId;
    
    try {
        const allRequests = await MessageRequest.find().populate({
            path: "from",
            match: { adminId: adminId },
            select: "-password"
        }).populate([
            {
                path: "conversationId",
                select: "blockedBy"
            },
            {
                path: "conversationId",
                populate: {
                    path: "participants",
                    select: "-password"
                }
            }
        ])
        const filteredRequests = allRequests.filter(request => request.from !== null);
        const formattedData = await RequestService.formatRequestData(filteredRequests, me);
        res.status(200).send(formattedData);
    } catch (error) {
        res.status(500).send(error);
    }
});

//ACCEPT MESSAGE REQUEST   
router.get("/accept/:id", async function (req, res) {
    try {
        const messageRequest = await MessageRequest.findOneAndUpdate({ _id: req.params.id }, { isAccepted: true }, { new: true }).populate("conversationId");
        if (messageRequest && messageRequest.isAccepted) {
            const newFriendList = new FriendList({
                conversationId: messageRequest.conversationId
            });
            await newFriendList.save();
        }
        res.status(200).send("OK");
    } catch (error) {
        res.status(500).send(error);
    }
});

//REJECT MESSAGE REQUEST
router.post("/reject/:id", async function (req, res) {
    try {
        await MessageRequest.findOneAndDelete({ _id: req.params.id });
        await Conversation.findOneAndDelete({ participants: { $all: [req.params.id, req.body.id] } });
        res.status(200).send("OK");
    } catch (error) {
        res.status(500).send(error);
    }
});

// GET MESSAGE REQUEST THROUGH CONVO ID
router.get("/:id", async function (req, res) {
    try {
        const request = await MessageRequest.findOne({
            conversationId: req.params.id,
            isAccepted: false,
        }).populate({
            path: "from",
            select: "_id"
        });

        res.status(200).send(request);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;