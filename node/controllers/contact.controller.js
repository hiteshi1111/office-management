const express = require('express'); 
const router = express.Router();
const ContactService = require("../services/contact.service")
const Contact = require("../schemas/contact.schema")
const Middleware = require("../middleware/auth.middleware");

router.post("/", function (req, res) {
    ContactService.contactUs(req.body).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get("/", Middleware.superAdminVerification, async function (req, res) {
    try {
        const submissions = await Contact.find();
        res.status(200).send(submissions);
    }catch(error){
        res.status(400).send(error);
    }
});

module.exports = router;