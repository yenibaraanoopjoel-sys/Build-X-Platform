const mongoose =
  require("mongoose");

const projectSchema =
  new mongoose.Schema(
    {
      //
      // PROJECT TITLE
      //
      title: {
        type: String,

        required: true,

        trim: true,
      },

      //
      // PROJECT DESCRIPTION
      //
      description: {
        type: String,

        default: "",

        trim: true,
      },

      //
      // PROJECT OWNER
      //
      owner: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      //
      // TEAM MEMBERS
      //
      members: [
        {
          type:
            mongoose.Schema.Types
              .ObjectId,

          ref: "User",
        },
      ],

      //
      // LINKED IDEA
      //
      linkedIdea: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Idea",
      },

      //
      // PROJECT COMPLETION
      //
      completionPercentage: {
        type: Number,

        min: 0,

        max: 100,

        default: 0,
      },

      //
      // PROJECT STATUS
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
      // TOTAL TASKS
      //
      totalTasks: {
        type: Number,

        default: 0,
      },

      //
      // COMPLETED TASKS
      //
      completedTasks: {
        type: Number,

        default: 0,
      },

      //
      // PROJECT PRIORITY
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
      // PROJECT VISIBILITY
      //
      visibility: {
        type: String,

        enum: [
          "Public",
          "Private",
        ],

        default:
          "Public",
      },

      //
      // PROJECT DEADLINE
      //
      deadline: {
        type: Date,
      },

      //
      // PROJECT TAGS
      //
      tags: [
        {
          type: String,

          trim: true,
        },
      ],

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
// SAFE ARRAY HANDLING
//
projectSchema.pre(
  "save",
  function (next) {
    if (
      !Array.isArray(
        this.members
      )
    ) {
      this.members =
        [];
    }

    if (
      !Array.isArray(
        this.tags
      )
    ) {
      this.tags = [];
    }

    //
    // AUTO CALCULATE
    // COMPLETION %
    //
    if (
      this.totalTasks > 0
    ) {
      this.completionPercentage =
        Math.round(
          (this.completedTasks /
            this.totalTasks) *
            100
        );
    } else {
      this.completionPercentage = 0;
    }

    //
    // AUTO STATUS
    //
    if (
      this.completionPercentage ===
      100
    ) {
      this.status =
        "Completed";
    } else if (
      this.completionPercentage >
      0
    ) {
      this.status =
        "In Progress";
    }

    next();
  }
);

//
// INDEXES
//
projectSchema.index({
  owner: 1,
});

projectSchema.index({
  linkedIdea: 1,
});

module.exports =
  mongoose.model(
    "Project",
    projectSchema
  );