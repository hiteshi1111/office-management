const express = require('express');
const router = express.Router();
const { createSecretToken } = require('../utils/secretToken');
const AdminService = require("../services/admin.service");
const PasswordService = require("../services/password.service");
const User = require("../schemas/user.schema");

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    AdminService.getAdminData(email).then((result) => {
        if (result.length > 0) {
            AdminService.verifyLogin(email, password).then(async (response) => {
                try {
                    const token = createSecretToken(response._id);
                    response.token = token;
                    res.status(200).send(response);
                } catch (error) {
                    console.log("first error", error);
                    res.status(400).send(error);
                }
            }).catch((error) => {
                res.status(400).send(error);
            });
        } else {
            res.status(404).send("Account not found!");
        }
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.post("/register", async (req, res) => {
    const { fullName, email, companyTitle, companyAddress, password } = req.body;
    try {
        const emailVerificationResponse = await AdminService.emailVerification(email);
        const passwordEncryptionResponse = PasswordService.passwordEncryption(password);
        const data = {
            fullName: fullName,
            email: email,
            companyTitle: companyTitle,
            companyAddress: companyAddress,
            password: passwordEncryptionResponse.password,
            otp: emailVerificationResponse,
        };
        const userId = await AdminService.adminSave(data);
        res.status(200).send({ otp: emailVerificationResponse, userId: userId });
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
});

//saves user data
router.post("/save/:id", function (req, res) {
    AdminService.activateAdmin(req.params.id).then((response) => {
        AdminService.createSubscription(req.params.id, req.body.plan).then((response) => {
            res.status(200).send(response);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.get("/sendOtp", function (req, res) {
    const { email, otp } = req.body;
    AdminService.emailVerification(email, otp).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

router.put("/:id", function (req, res) {
    AdminService.updateAccount(req.body, req.params.id).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

router.get("/employees/:id", async function (req, res) {
    try {
        const users = await User.find({ adminId: req.params.id }).select("-password").populate("role");
        res.status(200).send(users);
    } catch (err) {
        console.log("Error retrieving admin employees", err);
        res.status(500).send(err)
    }
})

module.exports = router;