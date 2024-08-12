const express = require('express');
const router = express.Router();
const Plan = require("../schemas/plan.schema");
const PlanService = require("../services/plan.service");
const { superAdminVerification } = require("../middleware/auth.middleware");

// FETCHES ALL PLANS ON PLAN PAGE
router.get("/", async function (req, res) {
    try{
        const plans = await Plan.find();
        res.status(200).send(plans);
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
});

// CREATES NEW PLAN
router.post('/:id', superAdminVerification, async (req, res) => {
    PlanService.addPlan(req.params.id, req.body).then(response => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

// CREATES NEW PLAN
router.put('/:id', superAdminVerification, async (req, res) => {
    console.log("im working");
    PlanService.updatePlan(req.params.id, req.body).then(response => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

// DELETES PLAN
router.delete("/:id", superAdminVerification, async (req, res) => {
    PlanService.deletePlan(req.params.id).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(400).send(error)
    })
})

module.exports = router;