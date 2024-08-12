const Subscription = require('../schemas/subscription.schema');
const Plans = require('../schemas/plan.schema');
const Users = require('../schemas/user.schema');
const Project = require('../schemas/project.schema');
const Task = require('../schemas/task.schema');
const Milestone = require('../schemas/milestone.schema');
const Settings = require('../schemas/settings.schema');
const Department = require('../schemas/department.schema');
const Role = require('../schemas/role.schema');
const Permission = require('../schemas/permission.schema');
const { default: mongoose } = require('mongoose');

let service = {};

service.createSubscription = createSubscription;
service.updateSubscription = updateSubscription;
service.getAdminList = getAdminList;
service.getsubscriptionStats = getsubscriptionStats;
service.deleteSubscribedUser = deleteSubscribedUser;

async function createSubscription(userId, planId) {
    try {
        const myPlan = await Plans.findById(planId)
        const startDate = new Date();

        // Calculate the expiration date
        const expiryDate = new Date(startDate);
        expiryDate.setDate(expiryDate.getDate() + myPlan.days);
        expiryDate.setMinutes(expiryDate.getMinutes() - 1);

        const data = {
            plan: planId,
            user: userId,
            startedOn: startDate,
            expiryOn: expiryDate
        };
        const newSubscription = new Subscription(data);
        await newSubscription.save();
        return true;
    } catch (error) {
        console.log("Error creating subscription", error);
        return Promise.reject("Error creating subscription");
    }
};

async function updateSubscription(adminId) {
    try {
        const data = await Subscription.findOneAndUpdate(
            { user: adminId },
            { $inc: { employeesAdded: 1 } }, 
            { new: true } 
        );
        return data;
    } catch (error) {
        console.log("Error in updating subscription", error);
        return Promise.reject("Unable to update subscription. Try again later!");
    }
}

async function getAdminList() {
    try {
        const admin = await Users.find({adminId:{$exists : false}});
        return admin;
    } catch (error) {
        return Promise.reject(error);
    }
}

async function getsubscriptionStats(data) {
    try {
        const result = {};
        data.forEach(item => {
            const date = item.date.toLocaleDateString().split('T')[0];
            if (!result[date]) {
                result[date] = 0;
            }
            result[date] += item.count;
        });
        return Object.keys(result).map(date => ({
            date,
            count: result[date]
        }));
    } catch (error) {
        return Promise.reject("Error getting subscription data");
    }
};

async function deleteSubscribedUser(id) {
    try {
        await deleteProjects(id)
        await deleteEmployees(id)
        await deleteRest(id)
        await Users.deleteMany({_id: id});
        return true;
    } catch (error) {
        console.log("deleteSubscribedUser error >", error);
        return Promise.reject(error);
    }
}

async function deleteProjects(id) {
    try {
        await Project.deleteMany({createdBy: id});
        await Task.deleteMany({createdBy: id});
        await Milestone.deleteMany({createdBy: id});
        return true;
    } catch (error) {
        console.log("deleteProjects error >", error);
        return Promise.reject(error);
    }
}

async function deleteEmployees(id) {
    try {
        const role = await Role.find().populate("departmentId");

        const filteredRoleIds = role.filter(index => {
            return index.departmentId?.adminId.toString() === id
        }).map(index => new mongoose.Types.ObjectId(index._id) )
        
        await Role.deleteMany({ _id: { $in: filteredRoleIds } });
        await Department.deleteMany({adminId: id});

        await Users.deleteMany({adminId: id});

        return true;
    } catch (error) {
        console.log("deleteEmployees error >", error);
        return Promise.reject(error);
    }
}

async function deleteRest(id) {
    try {
        await Settings.deleteMany({user: id});
        await Permission.deleteMany({userId: id});
        return true;
    } catch (error) {
        console.log("deleteRest error >", error);
        return Promise.reject(error);
    }
}

module.exports = service;