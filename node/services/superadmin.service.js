const SuperAdmin = require('../schemas/superadmin.schema');
const Admin = require("../schemas/user.schema");
const PasswordService = require("../services/password.service");
const Subscription = require('../schemas/subscription.schema');

let service = {};

service.verifyLogin = verifyLogin;
service.getSuperAdminData = getSuperAdminData;
service.getSuperAdminInfo = getSuperAdminInfo;
service.getAdminDetail = getAdminDetail;
service.getSuperAdmin = getSuperAdmin;

//FETCHES SINGLE USER DATA
async function getSuperAdmin(id){ 
    try {
        const user = await SuperAdmin.findById(id).select("-password").populate("role");
        return user;
    } catch (error) {
        return Promise.reject(error)
    }
}

async function getSuperAdminData(email) {
    try {
        const data = await SuperAdmin.find({ email: email });
        return data.length > 0 ? data : [];
    } catch (err) {
        console.log("Error retrieving super admin data", err);
        return Promise.reject("Error retrieving super admin data")
    }
}

async function verifyLogin(email, password) {
    try {
        const superadmin = await SuperAdmin.findOne({ email: email });
        if (!superadmin) {
            return Promise.reject("Account not found!");
        }
        const decryptedPassowrd = await PasswordService.passwordDecryption(superadmin.password);
        if (decryptedPassowrd === password) {
            const superAdminData  = await SuperAdmin.findOne({ email: email }).select("-password").populate("role");
            return { loggedIn: true, data: superAdminData };
        } else {
            return Promise.reject("Incorrect Password");
        }
    } catch (err) {
        console.log("Error in verifyLogin", err);
        return Promise.reject("Login Failed. Try again later!");
    }
}

async function getSuperAdminInfo(id) {
    try {
        const data = await SuperAdmin.findById(id).select('-password');
        return data ? data : [];
    } catch (err) {
        console.log("Error retrieving super admin data", err);
        return Promise.reject("Error retrieving super admin data");
    }
}

async function getAdminDetail(id) {
    try {
        const admin = await Admin.findById(id);
        if (!admin) {
            return Promise.reject("Error getting admin detail");
        }
        const subscription = await Subscription.find({ user: admin._id }).populate('plan');
        const data = {
            subscription: subscription,
            admin: admin
        }
        return data;
    } catch (error) {
        console.log("Error getting all admins request", error);
        return Promise.reject("Error getting all admins request");
    }
}

module.exports = service;