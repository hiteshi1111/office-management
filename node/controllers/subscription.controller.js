const express = require('express');
const router = express.Router();
const Subscription = require("../schemas/subscription.schema");
const SubscriptionService = require("../services/subscription.service");
const Middleware = require("../middleware/auth.middleware");

// FETCHES ALL SUBSCRIPTIONS ON SUBSCRIBERS PAGE
router.get('/', Middleware.superAdminVerification, (req, res) => {
    SubscriptionService.getAdminList().then(result => {
        res.status(200).send(result);
    }).catch(error => {
        res.status(500).send(error);
    })
});

router.get('/all', Middleware.superAdminVerification, async (req, res) => {
    try {
        const planData = await Subscription.find().populate('plan');
        const planType = {
            Free: { title: "Free", count: 0 },
            Premium: { title: "Premium", count: 0 }
        };
        planData.forEach(plan => {
            if (plan.plan.title === "Free") {
                planType.Free.count++;
            } else {
                planType.Premium.count++;
            }
        });
        const result = Object.values(planType);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/stats', Middleware.superAdminVerification, async (req, res) => {
    try {
        const planData = await Subscription.find().populate('plan');
        const planType = {
            Free: { title: "Free", data: [] },
            Premium: { title: "Premium", data: [] }
        };
        planData.forEach(plan => {
            const date = plan.startedOn;
            if (plan.plan.title === "Free") {
                planType.Free.data.push({ date, count: 1 });
            } else {
                planType.Premium.data.push({ date, count: 1 });
            }
        });
        const freeData = await SubscriptionService.getsubscriptionStats(planType.Free.data);
        const premiumData = await SubscriptionService.getsubscriptionStats(planType.Premium.data);
        const allDatesSet = new Set([...freeData.map(item => item.date), ...premiumData.map(item => item.date)]);
        const allDates = [...allDatesSet].sort();
        const aggregatedData = {
            Free: [],
            Premium: []
        };
        allDates.forEach(date => {
            const freeItem = freeData.find(item => item.date === date);
            const premiumItem = premiumData.find(item => item.date === date);
            if (freeItem) {
                aggregatedData.Free.push({
                    date,
                    count: freeItem.count
                });
            } else {
                aggregatedData.Free.push({
                    date,
                    count: 0
                });
            }
            if (premiumItem) {
                aggregatedData.Premium.push({
                    date,
                    count: premiumItem.count
                });
            } else {
                aggregatedData.Premium.push({
                    date,
                    count: 0
                });
            }
        });
        res.status(200).send(aggregatedData);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// FETCHES CURRENT SUBSCRIPTIONS OF USER
router.get("/:id", async function (req, res) {
    try {
        const currentPlan = await Subscription.findOne({ user: req.params.id }).populate("plan");
        res.status(200).send(currentPlan);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

// DELETE SUBSCRIBED USER AND ALL OF ITS DATA
router.delete("/:id", async function (req, res) {
    SubscriptionService.deleteSubscribedUser(req.params.id).then(result => {
        res.status(200).send(result);
    }).catch(error => {
        res.status(500).send(error);
    })
});

module.exports = router;