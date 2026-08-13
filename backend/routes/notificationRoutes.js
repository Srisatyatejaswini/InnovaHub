const express = require("express");

const router = express.Router();

const {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

// Get all notifications
router.get(
  "/",
  authMiddleware,
  getNotifications
);

// Get unread notification count
router.get(
  "/unread-count",
  authMiddleware,
  getUnreadNotificationCount
);

// Mark one notification as read
router.put(
  "/:id/read",
  authMiddleware,
  markNotificationAsRead
);

// Mark all notifications as read
router.put(
  "/read-all",
  authMiddleware,
  markAllNotificationsAsRead
);

module.exports = router;