const express = require("express");

const router = express.Router();

const {
  getSkillSwapUsers,
} = require(
  "../controllers/skillSwapController"
);

// Routes
router.get(
  "/",
  getSkillSwapUsers
);

module.exports = router;