const nodemailer = require("nodemailer");

const User = require('../schemas/user.schema');
const Department = require('../schemas/department.schema');
const MessageRequest = require("../schemas/messageRequest.schema");
const Settings = require("../schemas/settings.schema");
const Conversation = require("../schemas/conversation.schema");
const Role = require("../schemas/role.schema");

const PermissionServices = require('../services/permission.service');
const Subscription = require('../services/subscription.service');
const PasswordService = require('../services/password.service');

let service = {};

service.adminRegistration = adminRegistration,
service.createUser = createUser;
service.generateOtp = generateOtp;
service.userSave = userSave;
service.getUserData = getUserData;
service.verifyLogin = verifyLogin;
service.updateAccount = updateAccount;
service.getCompanyData = getCompanyData;
service.searchUsers = searchUsers;
service.userRegistration = userRegistration;
service.updatePassword = updatePassword;
service.deleteUser = deleteUser;

// UPDATES USER PASSWORD
async function updatePassword(id, body) {
    const { oldPassword, newPassword } = body;
    try {
        const user = await User.findByIdAndUpdate(id);
        const existingPassword = PasswordService.passwordDecryption(user?.password);
        if (oldPassword === existingPassword) {
            if (oldPassword === newPassword) {
                return Promise.reject("Old password and new password should not be same!")
            } else {
                const encryptedPassword = PasswordService.passwordEncryption(newPassword);
                await User.findByIdAndUpdate(id, { password: encryptedPassword })
                return true;
            }
        } else {
            return Promise.reject("Incorrect old password!")
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

// CREATES USER (CAN BE EITHER EMPLOYEE OR ADMIN)
async function adminRegistration(body) {
    try {
        const existingUser = await User.findOne({ email: body.email, isActive: true });
        if (existingUser) {
            return Promise.reject("Account already exists!");
        } else {
            const encryptedPassword = PasswordService.passwordEncryption(body.password);
            body.password = encryptedPassword;
            body.role = body.role || "664aff98e8f9cc7b1c162bf9";
            const user = await User.create(body);
            if (user) {
                await PermissionServices.defaultPermission(user._id);
            }
            return user;
        }
    } catch (error) {
        return Promise.reject("Unable to create User")
    }
}

async function userRegistration(id, body) {
    try {
        const existingUser = await User.findOne({ adminId: id, email: body.email });
        if (existingUser) {
            return Promise.reject("Account already exists!");
        } else {
            const encryptedPassword = PasswordService.passwordEncryption(body.password);
            body.password = encryptedPassword;
            body.isActive = true;
            body.adminId = id;
            const user = await User.create(body);
            if (user) {
                await PermissionServices.defaultPermission(user._id);
            }
            await Subscription.updateSubscription(id);
            return user;
        }
    } catch (error) {
        return Promise.reject("Unable to create User")
    }
}

// GENERATES OTP FOR EMAIL VERIFICATION
async function generateOtp(body) {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000);

        const emailtemplate = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f0f0f0;
                            margin: 0;
                            padding: 0;
                        }
                        .title {
                            color: #FF4081;
                            font-weight: bold;
                            font-size: 24px;
                            margin-bottom: 10px;
                            font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
                        }
                        .container {
                            max-width: 600px;
                            margin: auto;
                            background: #fff0f5;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                            text-align: center;
                            color: #fff;
                        }
                        .otp-content {
                            background-color: #fff;
                            color: #071e43;
                            padding: 20px;
                            border-radius: 5px;
                            margin-top: 20px;
                            border: 2px solid #FF4081;
                            text-align: left;
                        }
                        .logo {
                            max-height: 130px;
                            background: #fff0f5;
                        }
                        .otp-wrapper {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        .otp {
                            font-size: xx-large;
                            text-align: center;
                            background-color: aquamarine;
                            padding: 5px 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <img 
                            src="https://res.cloudinary.com/dixpqlscx/image/upload/v1721298216/czwi6zf8py74suh6futz.png"
                            alt="mantaraa"
                            class="logo"
                        />
                        <h1 class="title">Mantaraa Account Verification</h1>
                        <div class="otp-content">
                            <p>Hello Guest!</p>
                            <p>Thank you for registering with Mantaraa! We're excited to have you on board.</p>
                            <p>To complete your registration and activate your account, please verify your email address using the One-Time Password (OTP) provided below:</p>
                            <p> Your OTP:</p>
                            <div class="otp-wrapper">
                                <p class="otp"> ${otp} </p>
                            </div>
                            <p>Please enter this OTP on the Mantaraa website to complete your verification.</p>
                            <p>If you did not create an account with Mantaraa, please ignore this email.</p>
                            <p>Thank you for choosing Mantaraa. If you have any questions or need assistance, feel free to contact our support team.</p>
                            <p>Best regards,</p>
                            <p>The Mantaraa Team</p>
                        </div>
                    </div>
                </body>
            </html>
        `;

        // Create nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GOOGLE_MAIL,
                pass: process.env.GOOGLE_PASS,
            },
        });
        // Define email content
        const mailOptions = {
            from: process.env.GOOGLE_MAIL,
            to: body.email,
            subject: "Mantaraa Account Verification",
            html: emailtemplate,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        return {
            id: body._id,
            otp: otp
        };
    } catch (error) {
        return Promise.reject("Error sending otp");
    }
}

// SAVES USER
async function userSave(id, planId) {
    try {
        await User.findOneAndUpdate({ _id: id }, { isActive: true }, { new: true });
        await Subscription.createSubscription(id, planId);
        return true;
    } catch (error) {
        return Promise.reject("Unable to create User")
    }
}

//FETCHES SINGLE USER DATA
async function getUserData(id) {
    try {
        const user = await User.findOne({ _id: id }).select("-password").populate("role");
        const convo = await Conversation.findOne({
            participants: { $size: 1, $all: [id] }
        });
        return { convoId: convo?._id || "", ...user.toObject() };
    } catch (error) {
        return Promise.reject(error)
    }
}

// VERIFIES LOGIN DETAILS
async function verifyLogin(email, password) {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return Promise.reject("Account not found!");
        } else {
            if (user.isActive) {
                const decryptedPassword = await PasswordService.passwordDecryption(user.password);
                if (decryptedPassword === password) {
                    const userData = await User.findOne({ _id: user._id }).select("-password").populate("role");
                    const convo = await Conversation.findOne({
                        participants: { $size: 1, $all: [user._id] }
                    });
                    return { myConvo: convo?._id || "", ...userData.toObject()};
                } else {
                    return Promise.reject("Incorrect Password");
                }
            } else {
                return Promise.reject("Account not activated!");
            }
        }
    } catch (err) {
        console.log("err >>>", err)
        return Promise.reject(err);
    }
}

// UPDATES USER ACCOUNT
async function updateAccount(body, id) {
    try {
        const data = await User.findOneAndUpdate({ _id: id }, body, { new: true });
        return data;
    } catch (error) {
        console.log("Error in updating account", error);
        return Promise.reject("Unable to update account. Try again later!");
    }
}

// FETCHES USER'S COMPANY DATA
async function getCompanyData(adminId, departmentId) {
    try {
        const data = await User.findOne({ _id: adminId });
        const department = await Department.findOne({ _id: departmentId });
        const companyData = {
            companyTitle: data.companyTitle,
            companyAddress: data.companyAddress,
            companyEmail: data.companyEmail,
            companyMobile: data.companyMobile,
            department: department.title
        }
        return companyData;
    } catch (err) {
        console.log("Error retrieving data", err);
        return Promise.reject("Error retrieving data");
    }
}

// SEARCHES USER
async function searchUsers(body, userId) {
    try {
        if (body.adminId) {
            const users = await User.find({
                adminId: body.adminId,
                _id: { $ne: userId },
                $or: [
                    { fullName: { $regex: body.searchKey, $options: 'i' } },
                    { email: { $regex: body.searchKey, $options: 'i' } }
                ]
            });
            let updatedList = [];
            if (users.length > 0) {
                for (i = 0; i < users.length; i++) {
                    const ifExists = await MessageRequest.findOne({ to: users[i]._id, from: userId });
                    const settings = await Settings.findOne({ user: users[i]._id });
                    const convoId = await Conversation.findOne({ participants: { $all: [users[i]._id, userId] } });
                    const role  = await Role.findOne({_id : users[i].role})
                    if (ifExists) {
                        updatedList.push({
                            _id: users[i]._id,
                            fullName: users[i].fullName,
                            email: users[i].email,
                            avatar: users[i].avatar,
                            role: role,
                            gender: users[i].gender,
                            birthday: users[i].birthday,
                            createdAt: users[i].createdAt,
                            settings: settings,
                            sent: true,
                            blockedBy: convoId?.blockedBy || [],
                            convoId: convoId?._id
                        })
                    } else {
                        updatedList.push({
                            _id: users[i]._id,
                            fullName: users[i].fullName,
                            email: users[i].email,
                            avatar: users[i].avatar,
                            role: role,
                            gender: users[i].gender,
                            birthday: users[i].birthday,
                            createdAt: users[i].createdAt,
                            settings: settings,
                            sent: false,
                            blockedBy: convoId?.blockedBy || [],
                            convoId: convoId?._id
                        })
                    }
                }
                return updatedList;
            }
            return updatedList;
        } else {
            const users = await User.find({
                _id: { $ne: userId },
                $or: [
                    { fullName: { $regex: body.searchKey, $options: 'i' } },
                    { email: { $regex: body.searchKey, $options: 'i' } }
                ]
            });
            let updatedList = [];
            if (users.length > 0) {
                for (i = 0; i < users.length; i++) {
                    const ifExists = await MessageRequest.findOne({ to: users[i]._id, from: userId });                    const role  = await Role.findOne({_id : users[i].role})
                    const roleFind  = await Role.findOne({_id : users[i].role})

                    if (ifExists) {
                        updatedList.push({
                            _id: users[i]._id,
                            fullName: users[i].fullName,
                            avatar: users[i].avatar,
                            sent: true,
                            email: users[i].email,
                            role: roleFind,
                            gender: users[i].gender,
                            birthday: users[i].birthday,
                            createdAt: users[i].createdAt,

                        })
                    } else {
                        updatedList.push({
                            _id: users[i]._id,
                            fullName: users[i].fullName,
                            avatar: users[i].avatar,
                            sent: false,
                            email: users[i].email,
                            role: roleFind,
                            gender: users[i].gender,
                            birthday: users[i].birthday,
                            createdAt: users[i].createdAt,
                        })
                    }
                }
                return updatedList;
            }
            return updatedList;
        }
    } catch (error) {
        console.log("error >", error)
        return Promise.reject(error);
    }
}

// CREATE EMPLOYEE
async function createUser(body, adminId) {
    try {
        const existingUser = await User.findOne({ email: body.email })
        if (existingUser) {
            return Promise.reject("User already exists")
        }
        const password = PasswordService.passwordEncryption(body.password)
        const user = await User.create({
            fullName: body.fullName,
            email: body.email,
            password: password,
            adminId: adminId,
            department: body.department,
            gender: body.gender,
            role: body.role
        })
        if (user) {
            await PermissionServices.defaultPermission(user._id);
        }
        return user;
    } catch (error) {
        console.log("Error creating user", error)
        return Promise.reject("Unable to create User")
    }
}

async function deleteUser(id) {
    try {
        await User.findByIdAndDelete(id);
        return true;
    } catch (error) {
        return Promise.reject(error);
    }
}

module.exports = service