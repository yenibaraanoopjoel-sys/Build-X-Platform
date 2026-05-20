const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  getTasksByProject,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

// CREATE TASK
router.post(
  "/",
  protect,
  createTask
);

// GET ALL TASKS
router.get(
  "/",
  protect,
  getTasks
);

// GET TASKS BY PROJECT
router.get(
  "/project/:projectId",
  protect,
  getTasksByProject
);

// UPDATE TASK STATUS
router.put(
  "/:id",
  protect,
  updateTaskStatus
);

// DELETE TASK
router.delete(
  "/:id",
  protect,
  deleteTask
);

module.exports = router;