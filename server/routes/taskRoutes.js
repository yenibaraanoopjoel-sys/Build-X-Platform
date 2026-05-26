const express =
  require("express");

const router =
  express.Router();

//
// MIDDLEWARE
//
const protect =
  require(
    "../middleware/authMiddleware"
  );

//
// CONTROLLERS
//
const {
  createTask,
  getTasks,
  getTasksByProject,
  updateTaskStatus,
  deleteTask,
} = require(
  "../controllers/taskController"
);

//
// CREATE TASK
//
router.post(
  "/",
  protect,
  createTask
);

//
// GET ALL TASKS
//
router.get(
  "/",
  protect,
  getTasks
);

//
// GET TASKS BY PROJECT
//
router.get(
  "/project/:projectId",
  protect,
  getTasksByProject
);

//
// UPDATE TASK STATUS
//
router.put(
  "/:id",
  protect,
  updateTaskStatus
);

//
// DELETE TASK
//
router.delete(
  "/:id",
  protect,
  deleteTask
);

//
// TASK ROUTES HEALTH CHECK
//
router.get(
  "/health/check",
  (req, res) => {
    res.json({
      success: true,

      message:
        "Task routes working 🚀",
    });
  }
);

module.exports = router;