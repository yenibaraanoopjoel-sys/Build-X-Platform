const Notification =
  require(
    "../models/Notification"
  );

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
              req.user,
          }
        )
          .populate(
            "sender",
            "name email profilePicture role"
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

        notifications:
          Array.isArray(
            notifications
          )
            ? notifications
            : [],
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
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

      //
      // SECURITY CHECK
      //
      if (
        notification.receiver.toString() !==
        req.user.toString()
      ) {
        return res
          .status(403)
          .json({
            success: false,

            message:
              "Unauthorized",
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
      console.log(error);

      res.status(500).json({
        success: false,

        message:
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
            req.user,

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
      console.log(error);

      res.status(500).json({
        success: false,

        message:
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

      //
      // SECURITY CHECK
      //
      if (
        notification.receiver.toString() !==
        req.user.toString()
      ) {
        return res
          .status(403)
          .json({
            success: false,

            message:
              "Unauthorized",
          });
      }

      await notification.deleteOne();

      res.json({
        success: true,

        message:
          "Notification deleted successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
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
              req.user,

            isRead: false,
          }
        );

      res.json({
        success: true,

        unreadCount:
          count || 0,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };