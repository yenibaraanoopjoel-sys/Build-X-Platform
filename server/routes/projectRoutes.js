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
  createProject,
  getProjects,
  getProjectById,
  updateProjectStatus,
  addMember,
  deleteProject,
} = require(
  "../controllers/projectController"
);

//
// CREATE PROJECT
//
router.post(
  "/",
  protect,
  createProject
);

//
// GET ALL PROJECTS
//
router.get(
  "/",
  protect,
  getProjects
);

//
// GET SINGLE PROJECT
//
router.get(
  "/:id",
  protect,
  getProjectById
);

//
// UPDATE PROJECT STATUS
//
router.put(
  "/status/:id",
  protect,
  updateProjectStatus
);

//
// ADD MEMBER TO PROJECT
//
router.put(
  "/add-member/:id",
  protect,
  addMember
);

//
// DELETE PROJECT
//
router.delete(
  "/:id",
  protect,
  deleteProject
);

//
// PROJECT HEALTH CHECK
//
router.get(
  "/health/check",
  (req, res) => {
    res.json({
      success: true,

      message:
        "Project routes working 🚀",
    });
  }
);

module.exports = router;