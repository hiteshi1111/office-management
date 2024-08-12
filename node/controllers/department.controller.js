const express = require('express')
const router = express.Router();
const DepartmentService = require('../services/department.service')

router.post("/:id", function (req, res) {
    const { title, role } = req.body;
    DepartmentService.createDepartment(title, req.params.id, role).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(400).send(error);
    })
})

router.get("/:id", function (req, res) {
    DepartmentService.getDepartment(req.params.id).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        console.log(error)
        res.status(400).send(error)
    })
})

router.get("/roles/:id", function (req, res) {
    DepartmentService.getRoles(req.params.id).then((response) => {
        res.status(200).send(response)
    }).catch((error) => {
        console.log(error)
        res.status(400)
    })
});

router.post("/designation/:id", function (req, res) {
    const { deptId, role } = req.body;
    DepartmentService.createDesignation(deptId, req.params.id, role).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(400).send(error);
    })
})

module.exports = router;