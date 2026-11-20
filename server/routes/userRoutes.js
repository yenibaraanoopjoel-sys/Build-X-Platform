const express = require("express");

const router = express.Router();

//
// MIDDLEWARE
//
const protect = require("../middleware/authMiddleware");

//
// CONTROLLERS
//
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} = require("../controllers/userControllers");

//
// GET ALL USERS
//
router.get(
  "/all",
  protect,
  getAllUsers
);

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