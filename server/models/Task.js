const mongoose = require("mongoose");

const taskSchema =
  new mongoose.Schema(
    {
      // Task Title
      title: {
        type: String,

        required: true,
      },

      // Task Description
      description: {
        type: String,

        default: "",
      },

      // Linked Project
      project: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Project",

        required: true,
      },

      // Assigned User
      assignedTo: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      // Task Status
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

      // Task Progress
      progress: {
        type: Number,

        default: 0,
      },

      // Deadline
      deadline: {
        type: Date,
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Task",
    taskSchema
  );