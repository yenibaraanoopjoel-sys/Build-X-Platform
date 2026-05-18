require("dotenv").config();

const express = require("express");

const cors = require("cors");

const connectDB = require("./config/db");

const errorHandler = require("./middleware/errorMiddleware");

// Connect Database
connectDB();

// Create Express App
const app = express();

// Middleware
app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Debug Environment Variables
console.log(
  "OPENROUTER KEY EXISTS:",
  !!process.env.OPENROUTER_API_KEY
);

console.log(
  "MONGO URI EXISTS:",
  !!process.env.MONGO_URI
);

// Routes
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/user",
  require("./routes/userRoutes")
);

app.use(
  "/api/ideas",
  require("./routes/ideaRoutes")
);

app.use(
  "/api/projects",
  require("./routes/projectRoutes")
);

app.use(
  "/api/tasks",
  require("./routes/taskRoutes")
);

app.use(
  "/api/messages",
  require("./routes/messageRoutes")
);

// Skill Swap Routes
app.use(
  "/api/skillswap",
  require("./routes/skillSwapRoutes")
);

// AI Routes
app.use(
  "/api/ai",
  require("./routes/aiRoutes")
);

// Root Route
app.get("/", (req, res) => {
  res.send(
    "BuildX API Running 🚀"
  );
});

// Error Middleware
app.use(errorHandler);

// PORT
const PORT =
  process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});