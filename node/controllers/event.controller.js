const express = require('express');
const router = express.Router();
const EventService = require('../services/event.service')

router.post("/:id", async function (req,res){
    EventService.createEvent(req.body, req.params.id).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(400).send(error);
    })
})

router.get("/:id", async function (req,res){
    EventService.getEvent(req.params.id).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(400).send(error);
    })
})

router.put("/:id", async function (req,res){
    const {label} = req.body
    EventService.updateEvent(label, req.params.id).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

router.delete("/:id", async function (req,res){
    EventService.deleteEvent(req.params.id).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

router.get("/upcoming/:id", async function (req,res){
    EventService.upcomingEvent(req.params.id).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

module.exports = router