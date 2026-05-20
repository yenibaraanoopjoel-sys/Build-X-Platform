const mongoose = require("mongoose");

const projectSchema =
  new mongoose.Schema(
    {
      // Project Title
      title: {
        type: String,

        required: true,
      },

      // Project Description
      description: {
        type: String,

        default: "",
      },

      // Project Owner
      owner: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      // Team Members
      members: [
        {
          type:
            mongoose.Schema.Types
              .ObjectId,

          ref: "User",
        },
      ],

      // Linked Idea
      linkedIdea: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Idea",
      },

      // Project Completion
      completionPercentage: {
        type: Number,

        default: 0,
      },

      // Project Status
      status: {
        type: String,

        enum: [
          "Pending",
          "In Progress",
          "Completed",
        ],

        default:
          "Pending",
      },

      // Total Tasks
      totalTasks: {
        type: Number,

        default: 0,
      },

      // Completed Tasks
      completedTasks: {
        type: Number,

        default: 0,
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Project",
    projectSchema
  );