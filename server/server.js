require("dotenv").config();

const express = require("express");

const cors = require("cors");

const http = require("http");

const { Server } = require("socket.io");

const connectDB = require("./config/db");

const errorHandler = require("./middleware/errorMiddleware");

//
// INITIALIZE APP
//
const app = express();

//
// CREATE HTTP SERVER
//
const server = http.createServer(app);

//
// SOCKET.IO
//
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],
  },
});

//
// ONLINE USERS
//
const onlineUsers = new Map();

//
// SOCKET CONNECTION
//
io.on("connection", (socket) => {
  console.log(
    "⚡ User Connected:",
    socket.id
  );

  //
  // JOIN USER ROOM
  //
  socket.on(
    "join_user",
    (userId) => {
      socket.join(userId);

      onlineUsers.set(
        userId,
        socket.id
      );

      io.emit(
        "online_users",
        Array.from(
          onlineUsers.keys()
        )
      );

      console.log(
        `🟢 User Online: ${userId}`
      );
    }
  );

  //
  // SEND NOTIFICATION
  //
  socket.on(
    "send_notification",
    (data) => {
      io.to(
        data.receiverId
      ).emit(
        "receive_notification",
        data
      );
    }
  );

  //
  // SEND MESSAGE
  //
  socket.on(
    "send_message",
    (data) => {
      io.to(
        data.receiverId
      ).emit(
        "receive_message",
        data
      );
    }
  );

  //
  // USER TYPING
  //
  socket.on(
    "typing",
    (data) => {
      io.to(
        data.receiver
      ).emit(
        "user_typing",
        data
      );
    }
  );

  //
  // LIVE TASK UPDATE
  //
  socket.on(
    "task_updated",
    (data) => {
      io.emit(
        "task_update_received",
        data
      );
    }
  );

  //
  // LIVE PROJECT UPDATE
  //
  socket.on(
    "project_updated",
    (data) => {
      io.emit(
        "project_update_received",
        data
      );
    }
  );

  //
  // DISCONNECT
  //
  socket.on(
    "disconnect",
    () => {
      for (const [
        userId,
        socketId,
      ] of onlineUsers.entries()) {
        if (
          socketId ===
          socket.id
        ) {
          onlineUsers.delete(
            userId
          );

          console.log(
            `⚫ User Offline: ${userId}`
          );

          break;
        }
      }

      io.emit(
        "online_users",
        Array.from(
          onlineUsers.keys()
        )
      );

      console.log(
        "❌ User Disconnected:",
        socket.id
      );
    }
  );
});

//
// CONNECT DATABASE
//
connectDB();

//
// MIDDLEWARE
//
app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

//
// DEBUG ENV VARIABLES
//
console.log(
  "OPENROUTER KEY EXISTS:",
  !!process.env.OPENROUTER_API_KEY
);

console.log(
  "MONGO URI EXISTS:",
  !!process.env.MONGO_URI
);

//
// HEALTH CHECK
//
app.get(
  "/api/health/check",
  (req, res) => {
    res.json({
      success: true,
      message:
        "BuildX Backend Running 🚀",
    });
  }
);

//
// ROUTES
//

// AUTH
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

// USERS
app.use(
  "/api/users",
  require("./routes/userRoutes")
);

// IDEAS
app.use(
  "/api/ideas",
  require("./routes/ideaRoutes")
);

// PROJECTS
app.use(
  "/api/projects",
  require("./routes/projectRoutes")
);

// TASKS
app.use(
  "/api/tasks",
  require("./routes/taskRoutes")
);

// MESSAGES
app.use(
  "/api/messages",
  require("./routes/messageRoutes")
);

// SKILL SWAP
app.use(
  "/api/skillswap",
  require("./routes/skillSwapRoutes")
);

// COLLABORATIONS
app.use(
  "/api/collaborations",
  require(
    "./routes/collaborationRoutes"
  )
);

// NOTIFICATIONS
app.use(
  "/api/notifications",
  require(
    "./routes/notificationRoutes"
  )
);

// AI
app.use(
  "/api/ai",
  require("./routes/aiRoutes")
);

//
// ROOT
//
app.get("/", (req, res) => {
  res.send(
    "BuildX API Running 🚀"
  );
});

//
// ERROR HANDLER
//
app.use(errorHandler);

//
// PORT
//
const PORT =
  process.env.PORT || 5000;

//
// START SERVER
//
server.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});