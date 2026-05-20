const Notification = require("../models/Notification");

//
// GET USER NOTIFICATIONS
//
exports.getNotifications =
  async (req, res) => {
    try {
      const notifications =
        await Notification.find(
          {
            receiver:
              req.user._id,
          }
        )

          .populate(
            "sender",
            "name email profilePicture"
          )

          .populate(
            "project",
            "title"
          )

          .populate(
            "task",
            "title"
          )

          .populate(
            "idea",
            "title"
          )

          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,

        notifications,
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        error:
          error.message,
      });
    }
  };

//
// MARK AS READ
//
exports.markAsRead =
  async (req, res) => {
    try {
      const notification =
        await Notification.findById(
          req.params.id
        );

      if (!notification) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Notification not found",
          });
      }

      notification.isRead =
        true;

      await notification.save();

      res.json({
        success: true,

        message:
          "Notification marked as read",

        notification,
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        error:
          error.message,
      });
    }
  };

//
// MARK ALL AS READ
//
exports.markAllAsRead =
  async (req, res) => {
    try {
      await Notification.updateMany(
        {
          receiver:
            req.user._id,

          isRead: false,
        },
        {
          isRead: true,
        }
      );

      res.json({
        success: true,

        message:
          "All notifications marked as read",
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        error:
          error.message,
      });
    }
  };

//
// DELETE NOTIFICATION
//
exports.deleteNotification =
  async (req, res) => {
    try {
      const notification =
        await Notification.findById(
          req.params.id
        );

      if (!notification) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Notification not found",
          });
      }

      await notification.deleteOne();

      res.json({
        success: true,

        message:
          "Notification deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        error:
          error.message,
      });
    }
  };

//
// GET UNREAD COUNT
//
exports.getUnreadCount =
  async (req, res) => {
    try {
      const count =
        await Notification.countDocuments(
          {
            receiver:
              req.user._id,

            isRead: false,
          }
        );

      res.json({
        success: true,

        unreadCount:
          count,
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        error:
          error.message,
      });
    }
  };