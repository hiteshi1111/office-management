const Plan = require("../schemas/plan.schema")
const SuperAdmin = require("../schemas/superadmin.schema")

let service = {};

service.addPlan = addPlan;
service.updatePlan = updatePlan;
service.deletePlan = deletePlan;

async function addPlan(id, data) {
    try {
        const superAdmin = await SuperAdmin.findById(id).select("-password");
        if (!superAdmin) {
            return Promise.reject("Not authorized to add plan")
        }
        const plan = await Plan.create(data)
        return plan;
    } catch (err) {
        console.log("error adding plan", err)
        return Promise.reject("Error adding plan. Try again later!");
    }
}

async function deletePlan(id) {
    try {
        const data = await Plan.findOneAndDelete({ _id: id })
        return data;
    } catch (error) {
        console.log("Error deleting plan", error);
        return Promise.reject("Error deleting plan. Try again later!");
    }
}

async function updatePlan(id, body) {
    try {
        const data = await Plan.findOneAndUpdate( { _id: id }, body, { new: true } );
        return data;
    } catch (error) {
        console.log("Error in updating plan", error);
        return Promise.reject("Unable to update plan. Try again later!");
    }
}

module.exports = service;