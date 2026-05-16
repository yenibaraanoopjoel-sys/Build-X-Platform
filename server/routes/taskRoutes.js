const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

// Create Task
router.post("/", protect, createTask);

// Get All Tasks
router.get("/", protect, getTasks);

// Update Task Status
router.put("/:id", protect, updateTaskStatus);

// Delete Task
router.delete("/:id", protect, deleteTask);

module.exports = router;