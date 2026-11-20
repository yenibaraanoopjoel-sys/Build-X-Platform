const mongoose =
  require("mongoose");

const taskSchema =
  new mongoose.Schema(
    {
      //
      // TASK TITLE
      //
      title: {
        type: String,

        required: true,

        trim: true,
      },

      //
      // TASK DESCRIPTION
      //
      description: {
        type: String,

        default: "",

        trim: true,
      },

      //
      // LINKED PROJECT
      //
      project: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Project",

        required: true,
      },

      //
      // ASSIGNED USER
      //
      assignedTo: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      //
      // TASK STATUS
      //
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

      //
      // TASK PRIORITY
      //
      priority: {
        type: String,

        enum: [
          "Low",
          "Medium",
          "High",
        ],

        default:
          "Medium",
      },

      //
      // TASK PROGRESS
      //
      progress: {
        type: Number,

        min: 0,

        max: 100,

        default: 0,
      },

      //
      // DEADLINE
      //
      deadline: {
        type: Date,
      },

      //
      // TASK TAGS
      //
      tags: [
        {
          type: String,

          trim: true,
        },
      ],

      //
      // ATTACHMENTS
      //
      attachments: [
        {
          type: String,
        },
      ],

      //
      // TASK COMMENTS COUNT
      //
      commentsCount: {
        type: Number,

        default: 0,
      },

      //
      // ARCHIVED
      //
      archived: {
        type: Boolean,

        default: false,
      },
    },

    {
      timestamps: true,
    }
  );

//
// AUTO STATUS + PROGRESS
//
taskSchema.pre(
  "save",
  function (next) {
    //
    // SAFE ARRAYS
    //
    if (
      !Array.isArray(
        this.tags
      )
    ) {
      this.tags = [];
    }

    if (
      !Array.isArray(
        this.attachments
      )
    ) {
      this.attachments =
        [];
    }

    //
    // AUTO STATUS
    //
    if (
      this.progress ===
      100
    ) {
      this.status =
        "Completed";
    } else if (
      this.progress > 0
    ) {
      this.status =
        "In Progress";
    } else {
      this.status =
        "Pending";
    }

    next();
  }
);

//
// INDEXES
//
taskSchema.index({
  project: 1,
});

taskSchema.index({
  assignedTo: 1,
});

taskSchema.index({
  status: 1,
});

module.exports =
  mongoose.model(
    "Task",
    taskSchema
  );