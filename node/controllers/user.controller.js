const express = require('express')
const router = express.Router()
const UserService = require('../services/user.service')
const User = require('../schemas/user.schema')
const { createSecretToken } = require('../utils/secretToken');
const { decrypt } = require('../services/password.service');

// CREATES NEW INACTIVE ADMIN USER AND SENDS OTP TO EMAIL
router.post("/", (req, res) => {
    UserService.adminRegistration(req.body).then(response => {
        UserService.generateOtp(response).then(response => {
            res.status(200).send(response);
        }).catch(error => {
            console.log("register error", error);
            res.status(500).send(error);
        })
    }).catch(error => {
        console.log("register error", error);
        res.status(500).send(error);
    })
});

// SAVES NEW USER AND MARK IT ACTIVE
router.post("/save/:id", (req, res) => {
    UserService.userSave(req.params.id, req.body.plan).then(response => {
        res.status(200).send("OK");
    }).catch(error => {
        console.log("SAVE error", error);
        res.status(500).send(error);
    })
});

// LOGIN THE USER
router.post("/login", (req, res) => {
    const {email, password} = req.body;
    const decryptedPassword = decrypt(password);
    UserService.verifyLogin(email, decryptedPassword).then(async (response) => {
        try {
            const token = createSecretToken(response._id);
            response.token = token;
            res.status(200).send(response);
        } catch (error) {
            console.log("first error", error);
            res.status(400).send(error);
        }
    }).catch((error) => {
        res.status(500).send(error);
    });
});

// FETCHES SINGLE USER DATA
router.get("/:id", (req, res) => {
    UserService.getUserData(req.params.id).then(async (response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

// UPDATES USER ACCOUNT
router.put("/:id", function (req, res) {
    UserService.updateAccount(req.body, req.params.id).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

// FETCHES ADMIN'S EMPLOYEES
router.get("/employees/:id", async function (req, res) {
    try {
        const users = await User.find({ adminId: req.params.id }).select("-password").populate("role");
        res.status(200).send(users);
    } catch (err) {
        console.log("Error retrieving admin employees", err);
        res.status(500).send(err)
    }
})

// CREATES ADMIN'S EMPLOYEES
router.post("/employee/:id", (req, res) => {
    UserService.userRegistration(req.params.id, req.body).then(response => {
        res.status(200).send("OK");
    }).catch(error => {
        console.log("register error", error);
        res.status(500).send(error);
    })
});

// SEARCH USERS
router.post('/search/:id', async (req,res) => {
    UserService.searchUsers(req.body, req.params.id).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(500).send(error)
    });
})

// CREATES EMPLOYEE USER UNDER ADMIN
router.post('/:id', (req,res) => {
    UserService.createUser(req.body, req.params.id).then((response)=>{
        
        res.status(200).send(response)
    }).catch((error) => {
        console.log(error)
        res.status(500).send(error)
    })
})

// FETCHES COMPANY DATA
router.post('/company/:id', (req,res) => {
    UserService.getCompanyData(req.params.id, req.body.departmentId).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        console.log(error)
        res.status(500).send(error);
    })
})

// UPDATES USER ACCOUNT
router.put("/pass/:id", function (req, res) {
    UserService.updatePassword(req.params.id, req.body).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

// DELETES USER
router.delete("/:id", function (req, res) {
    UserService.deleteUser(req.params.id).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

module.exports = router