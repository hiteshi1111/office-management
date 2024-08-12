const dotenv = require("dotenv");
const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const cookieParser = require("cookie-parser");
// const { adminVerification } = require("./middleware/adminauthmiddleware");

dotenv.config();
const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(fileUpload({
    useTempFiles: true
}))

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())

mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME
}).then(resp => {
    console.log("Database Connected!")
}).catch(error => console.log("Unable to connect to DB!" + error));

app.get("/", (req, res) => {
    res.send("Welcome to Mantaraa Workified Servers!");
})

app.use("/api/user", require("./controllers/user.controller"));
app.use("/api/event", require("./controllers/event.controller"))
app.use("/api/superadmin", require("./controllers/superadmin.controller"));
app.use("/api/subscription", require("./controllers/subscription.controller"));
app.use("/api/permission", require("./controllers/permission.controller"));
app.use("/api/contact", require("./controllers/contact.controller"));
app.use("/api/settings", require("./controllers/settings.controller"));

// CHAT CONTROLLERS
app.use("/api/request", require("./controllers/messageRequest.controller"));
app.use("/api/message", require("./controllers/message.controller"));
app.use("/api/conversation", require("./controllers/conversation.controller"));
app.use('/api/friend', require('./controllers/friend.controller'));

// EMPLOYEE CONTROLLERS
app.use("/api/plan", require("./controllers/plan.controller"));
app.use('/api/department', require('./controllers/department.controller'))

// TASK CONTROLLERS
app.use('/api/project', require('./controllers/project.controller'));
app.use('/api/milestone', require('./controllers/milestone.controller'));
app.use('/api/task', require('./controllers/task.controller'));
app.use('/api/activity', require('./controllers/activity.controller'));

app.all("*", function (req, res) {
    res.status(404).send("Mantaraa Workified Servers!");
});

const server = app.listen(process.env.PORT, process.env.IP, () => {
    console.log(`Server started at ${process.env.PORT}!`);
})

require('./socket')(server);
