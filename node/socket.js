module.exports = (server) => {
    const io = require("socket.io")(server, {
        pingInterval: 10000, // send ping to client after each 10 seconds
        pingTimeout: 60000, // waits for 60 seconds before going off(wait for 60 seconds to receive pong from server, otherwise goes disconnect)
        cors: {
            origin: process.env.SOCKET_URL
        }
    });

    let onlineUsers = [];

    io.on("connection", (socket) => {
        socket.on('setup', (userData) => {
            socket.join(userData);
            socket.emit("connected");
        });
        socket.on('join', (room) => {
            if (socket.currentRoom) {
                socket.leave(socket.currentRoom);
            }
            socket.join(room);
            socket.currentRoom = room;
        });

        socket.on('task', (room) => {
            socket.join(room);

        });

        // User connects
        socket.on("new-user-add", (newUserId) => {
            const existingUser = onlineUsers.find((user) => user.userId === newUserId);
            if (existingUser) {
                existingUser.socketId = socket.id;
                existingUser.lastActive = Date.now();
            } else {
                onlineUsers.push({ userId: newUserId, socketId: socket.id, lastActive: Date.now() });
            }
            io.emit("get-users", onlineUsers);
        });

        // User becomes inactive
        socket.on("user-inactive", (userId) => {
            onlineUsers = onlineUsers.filter((user) => !(user.userId === userId && user.socketId === socket.id));
            io.emit("get-users", onlineUsers);
        });

        // User logout
        socket.on("logout", (userId) => {
            onlineUsers = onlineUsers.filter((user) => !(user.userId === userId && user.socketId === socket.id));
            io.emit("get-users", onlineUsers);
        });

        ///typing indicator
        socket.on('typing', (to, from) => {
            socket.in(to).emit('typing', { to: to, from: from });
        });

        // Single Chat --- send notification
        socket.on("first message", (data, friend) => {
            socket.in(data.to).emit("notification received", { data: data, friend: friend });
        });

        // Single Chat --- message sent and received
        socket.on("new message", (data, friend) => {
            socket.in(data.to).emit("message received", { data: data });
            socket.in(data.to).emit("notification received", { data: data, friend: friend });
            socket.emit("my message", { data: data });
        });

        ////////show emoji 
        socket.on("reactedEmoji", (messageId, emoji) => {
            io.emit("send emoji", { messageId: messageId, emoji: emoji });
        });

        ////////message is edited 
        socket.on("edit message", (to) => {
            socket.in(to).emit('updated chat', to);
        });


        ////////message is removed 
        socket.on("removed message", (s) => {
            io.emit('updatedChat', s);
        });

        ////////user is blocked - unblocked
        socket.on("user blocked", (id, data, by, message) => {
            // console.log("id, data, message", id, data, message)
            socket.in(id).emit('showBlocked', { id: id, data: data, by: by, message: message });
        });

        ////////send msg request
        socket.on("request sent", (id) => {
            socket.in(id).emit('show request', id);
        });

        // Single Chat is opened
        socket.on("openChat", (to, from, msgId, msg) => {
            // io.emit("opened our chat by one", { to: to, from: from });
            if (msgId && msg) {
                // console.log("to", to)

                socket.in(to).emit("msg is seen", { to: to, from: from, msgId: msgId, msg: msg });
                // console.log("1111111111111")
            }
            else {
                socket.in(to).emit("trigger friend chat", to);
                // console.log("2222222222222222")

            }
        });

        socket.on('projectupdated', ({ userId, assignees }) => {
            socket.emit('updation in project', { id: userId });
            if (assignees && Array.isArray(assignees)) {
                assignees.forEach((data) => {
                    io.in(data._id).emit("updation in project", { id: data._id, });
                });
            }
        });

        socket.on('taskadded', (id, projectId) => {
            io.in(id).emit("new task added", { id: id, });
            io.in(projectId).emit('updation in task', { data: projectId });
        });

        socket.on('taskupdated', ({ projectId, data, taskAssignees, message }) => {
            io.in(projectId).emit('updation in task', { data, message });
            if (taskAssignees && Array.isArray(taskAssignees)) {
                taskAssignees.forEach((data) => {
                    io.in(data._id).emit("new task added", { id: data._id, });
                });
            }
        });

        // MAKES CALLING TO ANOTHER END
        socket.on("calling", (to, from) => {
            socket.in(to._id).emit("calling me", {
                to: {
                    _id: to._id,
                    avatar: to.avatar,
                    fullName: to.fullName
                },
                from: {
                    _id: from._id,
                    avatar: from.avatar,
                    fullName: from.fullName
                },
            });
        });
        // MAKES CALLING TO ANOTHER END
        socket.on("end calling", (to, from) => {
            socket.in(to._id).emit("calling me", {});
        });
    });





    /////////////////////TASK//////////////////

    // New project added


};
