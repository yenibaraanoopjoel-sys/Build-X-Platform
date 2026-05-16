const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createIdea,
  getIdeas,
  getIdeaById,
  deleteIdea,
} = require("../controllers/ideaController");

// Create Idea
router.post("/", protect, createIdea);

// Get All Ideas
router.get("/", getIdeas);

// Get Single Idea
router.get("/:id", getIdeaById);

// Delete Idea
router.delete("/:id", protect, deleteIdea);

module.exports = router;