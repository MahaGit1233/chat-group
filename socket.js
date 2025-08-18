const { Server } = require("socket.io");

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const users = {};

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("new-user", (name) => {
      users[socket.id] = name;
      socket.broadcast.emit("user-connected", name);
    });

    socket.on("send-chat-message", (message) => {
      io.emit("chat-message", {
        message,
        name: users[socket.id],
      });
    });

    socket.on("disconnect", () => {
      io.emit("user-disconnected", users[socket.id]);
      delete users[socket.id];
    });
  });
}

module.exports = initSocket;
