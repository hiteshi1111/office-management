const express = require('express');
const router = express.Router();
const SettingsService = require('../services/settings.service');

//FETCHES SINGLE USER SETTINGS
router.get('/:id', async (req, res) => {
    try{
        const response = await SettingsService.getSettings(req.params.id)
        res.status(200).send(response);
    }catch(err){ 
        console.log(err)
        res.status(500).send(err);
    }
});

// UPDATES EXISTING USER SETTINGS
router.put('/:id', async (req, res) => {
    try{
        const response = await SettingsService.updateSettings(req.params.id, req.body)
        res.status(200).send(response);
    }catch(err){ 
        console.log(err)
        res.status(500).send(err);
    }
});

//CREATE NEW ENTRY OF USER SETTINGS
router.post('/:id', async (req, res) => {
    try{
        const response = await SettingsService.createSettings(req.params.id)
        res.status(200).send(response);
    }catch(err){ 
        console.log(err)
        res.status(500).send(err);
    }
});

module.exports = router;