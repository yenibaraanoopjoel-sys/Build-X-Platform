const express =
  require("express");

const router =
  express.Router();

//
// MIDDLEWARE
//
const protect =
  require(
    "../middleware/authMiddleware"
  );

//
// CONTROLLERS
//
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} = require(
  "../controllers/notificationController"
);

//
// HEALTH CHECK
//
router.get(
  "/health/check",
  (req, res) => {
    res.json({
      success: true,

      message:
        "Notification routes working 🚀",
    });
  }
);

//
// GET ALL NOTIFICATIONS
//
router.get(
  "/",
  protect,
  getNotifications
);

//
// GET UNREAD COUNT
//
router.get(
  "/unread-count",
  protect,
  getUnreadCount
);

//
// MARK SINGLE NOTIFICATION AS READ
//
router.put(
  "/read/:id",
  protect,
  markAsRead
);

//
// MARK ALL NOTIFICATIONS AS READ
//
router.put(
  "/read-all",
  protect,
  markAllAsRead
);

//
// DELETE NOTIFICATION
//
router.delete(
  "/:id",
  protect,
  deleteNotification
);

module.exports = router;