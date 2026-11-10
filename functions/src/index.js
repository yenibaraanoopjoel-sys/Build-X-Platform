const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

const app = express();

// Apply middleware
app.use(cors({ origin: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Mount API routes
app.use("/api", apiRoutes);
app.use("/", apiRoutes); // Support direct /analytics or /ai/chat if rewritten directly

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.path}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Cloud Function unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error occurred",
    message: err.message,
  });
});

// Export Cloud Function named 'api'
exports.api = functions.https.onRequest(app);

