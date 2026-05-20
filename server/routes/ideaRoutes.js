const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createIdea,
  getIdeas,
  getIdeaById,
  deleteIdea,
  likeIdea,
} = require("../controllers/ideaController");

// CREATE IDEA
router.post(
  "/",
  protect,
  createIdea
);

// GET ALL IDEAS
router.get(
  "/",
  getIdeas
);

// GET SINGLE IDEA
router.get(
  "/:id",
  getIdeaById
);

// LIKE / UNLIKE IDEA
router.put(
  "/like/:id",
  protect,
  likeIdea
);

// DELETE IDEA
router.delete(
  "/:id",
  protect,
  deleteIdea
);

module.exports = router;