const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

//
// GET PROFILE
//
router.get(
  "/profile",
  protect,
  getUserProfile
);

//
// UPDATE PROFILE
//
router.put(
  "/profile",
  protect,
  updateUserProfile
);

module.exports = router;