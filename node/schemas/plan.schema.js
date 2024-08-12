const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const planSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    employees: { type: Number, required: true },
    days: { type: Number, required: true }
}, { timestamps: true })

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;