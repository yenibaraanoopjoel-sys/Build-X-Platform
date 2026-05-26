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
  createIdea,
  getIdeas,
  getIdeaById,
  deleteIdea,
  likeIdea,
} = require(
  "../controllers/ideaController"
);

//
// CREATE IDEA
//
router.post(
  "/",
  protect,
  createIdea
);

//
// GET ALL IDEAS
//
router.get(
  "/",
  getIdeas
);

//
// GET SINGLE IDEA
//
router.get(
  "/:id",
  getIdeaById
);

//
// LIKE / UNLIKE IDEA
//
router.put(
  "/like/:id",
  protect,
  likeIdea
);

//
// DELETE IDEA
//
router.delete(
  "/:id",
  protect,
  deleteIdea
);

//
// HEALTH CHECK
//
router.get(
  "/health/check",
  (req, res) => {
    res.json({
      success: true,

      message:
        "Idea routes working 🚀",
    });
  }
);

module.exports = router;