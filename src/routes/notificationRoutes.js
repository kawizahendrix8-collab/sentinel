const express = require("express");
const router = express.Router();

const { createNotification, getNotifications, updateNotification, deleteNotification } = require("../controllers/notificationController.js");
const verifyToken = require("../middleware/authMiddleware.js");

router.post("/", verifyToken, createNotification);
router.get("/:projectId", verifyToken, getNotifications);
router.patch("/:id", verifyToken, updateNotification);
router.delete("/:id", verifyToken, deleteNotification);

module.exports = router;