const express = require('express');
const router = express.Router();
const SuperAdminService = require("../services/superadmin.service");
const { createSecretToken, activeTokens } = require('../utils/secretToken');
const Middleware = require("../middleware/auth.middleware");

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    SuperAdminService.getSuperAdminData(email).then((result) => {
        if (result.length > 0) {
            SuperAdminService.verifyLogin(email, password).then(async (response) => {
                try {
                    const token = await createSecretToken(response.data.id);
                    const adminData = {
                        _id: response.data.id,
                        fullName: response.data.fullName,
                        email: response.data.email,
                        role: response.data.role,
                        createdAt: response.data.createdAt,
                        token: token
                    };
                    activeTokens[adminData.id] = token;
                    res.status(200).send(adminData);
                } catch (error) {
                    res.status(400).send(error);
                }
            }).catch((error) => {
                res.status(400).send(error);
            });
        } else {
            res.status(404).send({ error: "Account not found!" });
        }
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/admin', Middleware.superAdminVerification, (req, res) => {
    const id = req.query.id;
    SuperAdminService.getAdminDetail(id).then(result => {
        res.status(200).send(result);
    }).catch(error => {
        res.status(500).send(error);
    })
});

// FETCHES SINGLE ADMIN DATA
router.get("/:id", (req, res) => {
    SuperAdminService.getSuperAdmin(req.params.id).then(async (response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get('/getsuperadmin', (req, res) => {
    const { id } = req.query
    SuperAdminService.getSuperAdminInfo(id)
        .then(response => {
            res.status(200).send(response)
        }).catch((error) => {
            res.status(400).send(error)
        })
})

// router.get('/plan',  async (req, res) => {
//     console.log(">>weqdwed>")
//     try {
//         const subscriptions = await Subscription.find().populate('plan');
//         const planDetailsArray = [];
//         const planIdCounts = {};
//         subscriptions.forEach(subscription => {
//             const planId = subscription.plan.id.toString();
//             if (planIdCounts[planId]) {
//                 planIdCounts[planId]++;
//             } else {
//                 planIdCounts[planId] = 1;
//                 planDetailsArray.push({
//                     plan: subscription.plan,
//                     count: 1
//                 });
//             }
//         });
//         planDetailsArray.forEach(planDetails => {
//             const planId = planDetails.plan.id.toString();
//             planDetails.count = planIdCounts[planId];
//         });
//         res.status(200).json(planDetailsArray);
//     } catch (err) {
//         console.log(err);
//         res.status(500).send(err);
//     }
// });

router.put("/:id", Middleware.superAdminVerification, async (req, res) => {
    SuperAdminService.updatePlan(req.body, req.params.id).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

module.exports = router;