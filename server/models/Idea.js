const mongoose =
  require("mongoose");

const ideaSchema =
  new mongoose.Schema(
    {
      //
      // IDEA TITLE
      //
      title: {
        type: String,

        required: true,

        trim: true,
      },

      //
      // IDEA DESCRIPTION
      //
      description: {
        type: String,

        required: true,

        trim: true,
      },

      //
      // TECH STACK
      //
      techStack: [
        {
          type: String,

          trim: true,
        },
      ],

      //
      // IDEA CATEGORY
      //
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

        default:
          "Other",
      },

      //
      // IDEA CREATOR
      //
      createdBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      //
      // COLLABORATORS
      //
      collaborators: [
        {
          type:
            mongoose.Schema.Types
              .ObjectId,

          ref: "User",
        },
      ],

      //
      // LINKED PROJECT
      //
      linkedProject: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Project",
      },

      //
      // LIKES
      //
      likes: [
        {
          type:
            mongoose.Schema.Types
              .ObjectId,

          ref: "User",
        },
      ],

      //
      // IDEA STATUS
      //
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

      //
      // VISIBILITY
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
      // FEATURED IDEA
      //
      featured: {
        type: Boolean,

        default: false,
      },

      //
      // TOTAL VIEWS
      //
      views: {
        type: Number,

        default: 0,
      },
    },

    {
      timestamps: true,
    }
  );

//
// SAFE ARRAY HANDLING
//
ideaSchema.pre(
  "save",
  function (next) {
    if (
      !Array.isArray(
        this.techStack
      )
    ) {
      this.techStack =
        [];
    }

    if (
      !Array.isArray(
        this.collaborators
      )
    ) {
      this.collaborators =
        [];
    }

    if (
      !Array.isArray(
        this.likes
      )
    ) {
      this.likes = [];
    }

    next();
  }
);

//
// INDEXES
//
ideaSchema.index({
  createdBy: 1,
});

ideaSchema.index({
  category: 1,
});

module.exports =
  mongoose.model(
    "Idea",
    ideaSchema
  );