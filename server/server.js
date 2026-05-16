const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const errorHandler = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

// Create Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Test Route
app.get("/", (req, res) => {
  res.send("BuildX API Running 🚀");
});

// Error Middleware
app.use(errorHandler);

// Start Server
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});