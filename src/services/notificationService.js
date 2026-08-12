const emailService = require("./emailService.js");
const webhookNotificationService = require("./webhookNotificationService.js");


const notificationStore = require("../database/notificationStore.js");
const projectStore = require("../database/projectStore.js");

async function createNotification(data, userId) {
  if (!data.projectId) {
    return { success: false, message: "projectId is required" };
  }
  if (!data.type) {
    return { success: false, message: "type is required" };
  }
  if (!data.destination) {
    return { success: false, message: "destination is required" };
  }

  const project = await projectStore.findProjectById(data.projectId);
  if (!project.success) {
    return { success: false, message: "Project not found" };
  }
  if (project.data.userId !== userId) {
    return { success: false, message: "Not authorized" };
  }

  const newNotification = {
    id: "notif_" + Date.now(),
    projectId: data.projectId,
    type: data.type,
    destination: data.destination,
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return await notificationStore.createNotification(newNotification);
}

async function getNotifications(projectId, userId) {
  const project = await projectStore.findProjectById(projectId);
  if (!project.success) {
    return { success: false, message: "Project not found" };
  }
  if (project.data.userId !== userId) {
    return { success: false, message: "Not authorized" };
  }

  return await notificationStore.getNotificationsByProjectId(projectId);
}

async function updateNotification(id, updates, userId) {
  const notification = await notificationStore.findNotificationById(id);
  if (!notification.success) {
    return notification;
  }

  const project = await projectStore.findProjectById(notification.data.projectId);
  if (!project.success || project.data.userId !== userId) {
    return { success: false, message: "Not authorized" };
  }

  return await notificationStore.updateNotification(id, updates);
}

async function deleteNotification(id, userId) {
  const notification = await notificationStore.findNotificationById(id);
  if (!notification.success) {
    return notification;
  }

  const project = await projectStore.findProjectById(notification.data.projectId);
  if (!project.success || project.data.userId !== userId) {
    return { success: false, message: "Not authorized" };
  }

  return await notificationStore.deleteNotification(id);
}

async function triggerFailureNotifications(event, project) {
  const notifications = await notificationStore.getNotificationsByProjectId(project.id);

  for (const notification of notifications) {
    if (!notification.enabled) {
      continue;
    }

    let result;

    if (notification.type === "email") {
      result = await emailService.sendFailureEmail(notification.destination, event, project);
    } else if (notification.type === "webhook") {
      result = await webhookNotificationService.sendFailureWebhook(notification.destination, event, project);
    }

    const delivery = {
      id: "del_" + Date.now() + "_" + Math.random().toString(36).slice(2),
      notificationId: notification.id,
      eventId: event.id,
      status: result.success ? "sent" : "failed",
      attemptedAt: new Date(),
      error: result.success ? null : result.message
    };

    try {
      await notificationStore.recordDelivery(delivery);
    } catch (err) {
      console.log("Failed to record delivery:", err.message);
    }
  }
}

module.exports = { createNotification, getNotifications, updateNotification, deleteNotification, triggerFailureNotifications };