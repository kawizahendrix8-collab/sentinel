const notificationService = require("../services/notificationService.js");

async function createNotification(req, res) {
  const data = req.body;
  const userId = req.user.id;

  const result = await notificationService.createNotification(data, userId);

  res.status(201).json(result);
}

async function getNotifications(req, res) {
  const projectId = req.params.projectId;
  const userId = req.user.id;

  const result = await notificationService.getNotifications(projectId, userId);

  res.json(result);
}

async function updateNotification(req, res) {
  const id = req.params.id;
  const userId = req.user.id;
  const updates = req.body;

  const result = await notificationService.updateNotification(id, updates, userId);

  res.json(result);
}

async function deleteNotification(req, res) {
  const id = req.params.id;
  const userId = req.user.id;

  const result = await notificationService.deleteNotification(id, userId);

  res.json(result);
}

module.exports = { createNotification, getNotifications, updateNotification, deleteNotification };