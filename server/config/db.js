const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️ MONGO_URI not provided. Server will run with in-memory fallbacks.");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("⚠️ MongoDB Connection Warning:", error.message);
    console.log("ℹ️ Server will continue running with API fallback responses.");
  }
};

module.exports = connectDB;
