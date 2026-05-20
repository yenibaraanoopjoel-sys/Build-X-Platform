const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProjectStatus,
  addMember,
  deleteProject,
} = require("../controllers/projectController");

// CREATE PROJECT
router.post(
  "/",
  protect,
  createProject
);

// GET ALL PROJECTS
router.get(
  "/",
  protect,
  getProjects
);

// GET SINGLE PROJECT
router.get(
  "/:id",
  protect,
  getProjectById
);

// UPDATE PROJECT STATUS
router.put(
  "/status/:id",
  protect,
  updateProjectStatus
);

// ADD MEMBER TO PROJECT
router.put(
  "/add-member/:id",
  protect,
  addMember
);

// DELETE PROJECT
router.delete(
  "/:id",
  protect,
  deleteProject
);

module.exports = router;