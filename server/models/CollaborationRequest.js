const mongoose =
  require("mongoose");

const collaborationRequestSchema =
  new mongoose.Schema(
    {
      //
      // USER WHO SENT REQUEST
      //
      sender: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      //
      // USER WHO RECEIVES REQUEST
      //
      receiver: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      //
      // RELATED IDEA
      //
      idea: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Idea",
      },

      //
      // RELATED PROJECT
      //
      project: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Project",
      },

      //
      // TITLE
      //
      title: {
        type: String,

        trim: true,

        default: "",
      },

      //
      // REQUEST TYPE
      //
      requestType: {
        type: String,

        enum: [
          "Idea Collaboration",
          "Project Collaboration",
          "Skill Swap",
        ],

        default:
          "Idea Collaboration",
      },

      //
      // OPTIONAL MESSAGE
      //
      message: {
        type: String,

        trim: true,

        default: "",
      },

      //
      // REQUEST STATUS
      //
      status: {
        type: String,

        enum: [
          "Pending",
          "Accepted",
          "Rejected",
        ],

        default:
          "Pending",
      },

      //
      // SOCKET / LIVE STATUS
      //
      isRealtime: {
        type: Boolean,

        default: true,
      },
    },

    {
      timestamps: true,
    }
  );

//
// INDEXES
//
collaborationRequestSchema.index(
  {
    sender: 1,

    receiver: 1,

    idea: 1,
  }
);

module.exports =
  mongoose.model(
    "CollaborationRequest",
    collaborationRequestSchema
  );