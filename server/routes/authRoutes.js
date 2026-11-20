const express = require("express");
const router = express.Router();
const { register, login, getMe, logout, forgotPassword, updateProfile } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

// Protected routes
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.put("/profile", protect, updateProfile);

module.exports = router;
