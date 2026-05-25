const mongoose =
  require("mongoose");

const notificationSchema =
  new mongoose.Schema(
    {
      //
      // RECEIVER
      //
      receiver: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      //
      // SENDER
      //
      sender: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      //
      // NOTIFICATION TYPE
      //
      type: {
        type: String,

        enum: [
          "COLLAB_REQUEST",
          "REQUEST_ACCEPTED",
          "REQUEST_REJECTED",
          "TASK_ASSIGNED",
          "TASK_COMPLETED",
          "PROJECT_COMPLETED",
          "NEW_MEMBER",
          "GENERAL",
        ],

        default:
          "GENERAL",
      },

      //
      // MESSAGE
      //
      message: {
        type: String,

        required: true,

        trim: true,
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
      // RELATED TASK
      //
      task: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Task",
      },

      //
      // RELATED COLLAB REQUEST
      //
      collaborationRequest: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref:
          "CollaborationRequest",
      },

      //
      // READ STATUS
      //
      isRead: {
        type: Boolean,

        default: false,
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Notification",
    notificationSchema
  );