const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // BASIC INFO
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

    // PROFILE INFO
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

    // PROFESSIONAL ROLE
    role: {
      type: String,
      default: "Collaborator",
    },

    // EXPERIENCE
    experienceLevel: {
      type: String,

      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
      ],

      default:
        "Beginner",
    },

    // SKILLS USER HAS
    skillsHave: {
      type: [String],

      default: [],
    },

    // SKILLS USER WANTS
    skillsWant: {
      type: [String],

      default: [],
    },

    // INTERESTS
    interests: {
      type: [String],

      default: [],
    },

    // ACTIVE PROJECTS
    activeProjects: [
      {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Project",
      },
    ],

    // TASKS ASSIGNED
    assignedTasks: [
      {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Task",
      },
    ],

    // COLLABORATION SCORE
    contributionScore: {
      type: Number,

      default: 0,
    },

    // PRODUCTIVITY SCORE
    productivityScore: {
      type: Number,

      default: 0,
    },

    // COMPLETED PROJECTS
    completedProjects: {
      type: Number,

      default: 0,
    },

    // COMPLETED TASKS
    completedTasks: {
      type: Number,

      default: 0,
    },

    // SESSIONS COMPLETED
    sessionsCompleted: {
      type: Number,

      default: 0,
    },

    // GITHUB
    github: {
      type: String,

      default: "",
    },

    // LINKEDIN
    linkedin: {
      type: String,

      default: "",
    },

    // PORTFOLIO
    portfolio: {
      type: String,

      default: "",
    },

    // AVAILABILITY
    availability: {
      type: String,

      enum: [
        "Available",
        "Busy",
        "Offline",
      ],

      default:
        "Available",
    },

    // ONLINE STATUS
    isOnline: {
      type: Boolean,

      default: false,
    },
  },

  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.User ||
  mongoose.model(
    "User",
    userSchema
  );