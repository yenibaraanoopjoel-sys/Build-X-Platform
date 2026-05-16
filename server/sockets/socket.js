const socketIO = require("socket.io");

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Join Personal Room
    socket.on("joinRoom", (userId) => {
      socket.join(userId);

      console.log(`User ${userId} joined room`);
    });

    // Send Message
    socket.on("sendMessage", (data) => {
      const { sender, receiver, text } = data;

      io.to(receiver).emit("receiveMessage", {
        sender,
        receiver,
        text,
        createdAt: new Date(),
      });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initializeSocket;