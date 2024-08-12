const express = require('express');
const router = express.Router();
const FriendService = require('../services/friend.service');

//REMOVES FRIEND
router.put('/remove/:id', async (req, res) => {
    FriendService.removeFriend(req.params.id, req.body).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.put('/block/:id', async (req, res) => {
    try{
        const response = await FriendService.blockFriend(req.params.id, req.body);
        res.status(200).send(response);
    }catch(err){ 
        console.log(err)
        res.status(500).send(err);
    }
});

module.exports = router;