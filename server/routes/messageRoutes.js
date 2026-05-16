const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

// Send Message
router.post("/", protect, sendMessage);

// Get Messages
router.get("/", protect, getMessages);

module.exports = router;