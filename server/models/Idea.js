const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema(
  {
    // Idea Title
    title: {
      type: String,
      required: true,
    },

    // Idea Description
    description: {
      type: String,
      required: true,
    },

    // Tech Stack
    techStack: [
      {
        type: String,
      },
    ],

    // Idea Category
    category: {
      type: String,

      enum: [
        "AI",
        "Web Development",
        "Mobile App",
        "UI/UX",
        "Blockchain",
        "Cybersecurity",
        "Research",
        "Startup",
        "Other",
      ],

      default: "Other",
    },

    // Idea Creator
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    // Collaborators
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: "User",
      },
    ],

    // Linked Project
    linkedProject: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Project",
    },

    // Likes
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: "User",
      },
    ],

    // Idea Status
    status: {
      type: String,

      enum: [
        "Open",
        "In Progress",
        "Completed",
        "Converted",
      ],

      default: "Open",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Idea",
  ideaSchema
);