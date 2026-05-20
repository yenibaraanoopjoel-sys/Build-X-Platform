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
const server =
  http.createServer(app);

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
const onlineUsers =
  new Map();

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

      // STORE ONLINE USER
      onlineUsers.set(
        userId,
        socket.id
      );

      // SEND ONLINE USERS
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
      // REMOVE USER
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

      // UPDATE ONLINE USERS
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

// ENABLE CORS
app.use(cors());

// JSON PARSER
app.use(express.json());

// URL ENCODED PARSER
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
// ROUTES
//

// AUTH ROUTES
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

// USER ROUTES
app.use(
  "/api/user",
  require("./routes/userRoutes")
);

// IDEA ROUTES
app.use(
  "/api/ideas",
  require("./routes/ideaRoutes")
);

// PROJECT ROUTES
app.use(
  "/api/projects",
  require("./routes/projectRoutes")
);

// TASK ROUTES
app.use(
  "/api/tasks",
  require("./routes/taskRoutes")
);

// MESSAGE ROUTES
app.use(
  "/api/messages",
  require("./routes/messageRoutes")
);

// SKILL SWAP ROUTES
app.use(
  "/api/skillswap",
  require("./routes/skillSwapRoutes")
);

// COLLABORATION ROUTES
app.use(
  "/api/collaborations",
  require(
    "./routes/collaborationRoutes"
  )
);

// NOTIFICATION ROUTES
app.use(
  "/api/notifications",
  require(
    "./routes/notificationRoutes"
  )
);

// AI ROUTES
app.use(
  "/api/ai",
  require("./routes/aiRoutes")
);

//
// ROOT ROUTE
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