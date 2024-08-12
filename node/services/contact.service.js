const Contact = require("../schemas/contact.schema");

let service = {};
service.contactUs = contactUs;

async function contactUs(data) {
    try {
        const submissionData = await Contact.create(data);
        return submissionData;
    } catch (error) {
        return Promise.reject({ error: 'Something went wrong. Try again later!' });
    }
}

module.exports = service;