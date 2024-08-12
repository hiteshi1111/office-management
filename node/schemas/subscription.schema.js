const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    user: { type: mongoose.Schema.ObjectId, ref: "User"},
    plan: { type: mongoose.Schema.ObjectId, ref: "Plan"},
    startedOn: { type: Date, default: Date.now() },
    expiryOn: { type: Date, default: Date.now() },
    employeesAdded: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
})

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;