const Settings = require('../schemas/settings.schema');

let service = {};

service.createSettings = createSettings;
service.getSettings = getSettings;
service.updateSettings = updateSettings;

// CREATES USER SETTINGS
async function createSettings(id) {
    const data = {
        user: id
    }
    try {
        const newEntry = new Settings(data);
        const settings = await newEntry.save();
        return settings;
    } catch (error) {
        return Promise.reject(error)
    }
}

// FETCHES USER SETTINGS
async function getSettings(id) {
    try {
        const settings = await Settings.findOne({user: id});
        return settings;
    } catch (error) {
        return Promise.reject(error)
    }
}

// UPDATES USER SETTINGS
async function updateSettings(id, body={}) {
    try {
        const ifExists = await Settings.findOne({user: id});
        if (ifExists){
            const settings = await Settings.findOneAndUpdate({user: id}, body, {new: true});
            return settings;
        }else{
            body.user = id
            const newEntry = new Settings(body);
            const settings = await newEntry.save();
            return settings;
        }
    } catch (error) {
        return Promise.reject(error)
    }
}

module.exports = service;