const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Profile Info
    bio: {
      type: String,
      default: "",
    },

    profilePicture: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    // Skill Swapping
    skillsHave: {
      type: [String],
      default: [],
    },

    skillsWant: {
      type: [String],
      default: [],
    },

    // User Role
    role: {
      type: String,
      enum: [
        "learner",
        "mentor",
        "collaborator",
      ],
      default: "learner",
    },

    // Contribution System
    contributionScore: {
      type: Number,
      default: 0,
    },

    completedProjects: {
      type: Number,
      default: 0,
    },

    sessionsCompleted: {
      type: Number,
      default: 0,
    },

    // Social Links
    github: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    portfolio: {
      type: String,
      default: "",
    },

    // Availability
    availability: {
      type: String,
      enum: [
        "Available",
        "Busy",
        "Offline",
      ],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema);