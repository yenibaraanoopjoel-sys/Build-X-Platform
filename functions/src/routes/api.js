const express = require("express");
const router = express.Router();

const { verifyAuth, optionalAuth } = require("../middleware/authMiddleware");
const { handleAIChat } = require("../controllers/aiController");
const { generateVideoToken } = require("../controllers/videoController");
const { getAnalytics } = require("../controllers/analyticsController");
const { getMatchingUsers } = require("../controllers/matchController");
const { syncUserProfile } = require("../controllers/authController");

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "BuildX Cloud Functions API",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Authentication & Profile sync
router.post("/auth/sync", optionalAuth, syncUserProfile);

// AI Assistant (JARVIS)
router.post("/ai/chat", optionalAuth, handleAIChat);
router.post("/ai", optionalAuth, handleAIChat); // backward compatibility for legacy frontend

// Video Meeting Credentials
router.post("/video/token", optionalAuth, generateVideoToken);

// Real Database Analytics & Metrics
router.get("/analytics", optionalAuth, getAnalytics);

// Intelligent Skill Matching
router.get("/match/users", optionalAuth, getMatchingUsers);

module.exports = router;

