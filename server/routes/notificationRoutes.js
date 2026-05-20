const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} = require("../controllers/notificationController");

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
// MARK AS READ
//
router.put(
  "/read/:id",
  protect,
  markAsRead
);

//
// MARK ALL AS READ
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