const Event = require("../schemas/event.schema")

let service = {}
service.createEvent = createEvent
service.getEvent = getEvent
service.updateEvent = updateEvent
service.deleteEvent = deleteEvent
service.upcomingEvent = upcomingEvent

async function createEvent(body, id) {
    try {
        const data = {
            label: body.label,
            eventDate: body.eventDate,
            adminId: id
        }
        const newEvent = new Event(data)
        const event = await newEvent.save()
        return event
    } catch (error) {
        console.log("Error creating event", error);
        return Promise.reject("Error creating event");
    }
}

async function getEvent(id) {
    try {
        const data = await Event.find({ adminId: id }).sort({ eventDate: -1 })
        return data
    } catch (error) {
        console.log("Error getting events", error);
        return Promise.reject("Error getting events");
    }
}

async function updateEvent(label, id) {
    try {
        const data = await Event.findOneAndUpdate({ _id: id }, { label: label }, { new: true })
        return data
    } catch (error) {
        console.log("Error getting events", error);
        return Promise.reject("Error getting events");
    }
}

async function deleteEvent(id) {
    try {
        const data = await Event.findOneAndDelete({ _id: id })
        return data
    } catch (error) {
        console.log("Error deleting events", error);
        return Promise.reject("Error deleting events");
    }
}

async function upcomingEvent(id) {
    try {
        const currentTime = new Date()
        const data = await Event.find({
            adminId: id,
            eventDate: { $gt: currentTime }
        });
        return data
    } catch (error) {
        console.log("Error getting upcoming events", error)
        return Promise.reject("Error getting upcoming events")
    }
}

module.exports = service