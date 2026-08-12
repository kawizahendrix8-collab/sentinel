const pool = require("./db.js");

function toCamelCase(row) {
  return {
    id: row.id,
    projectId: row.project_id,
    type: row.type,
    destination: row.destination,
    enabled: row.enabled,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function createNotification(notification) {
  try {
    const result = await pool.query(
      `INSERT INTO notifications (id, project_id, type, destination, enabled, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [notification.id, notification.projectId, notification.type, notification.destination, notification.enabled, notification.createdAt, notification.updatedAt]
    );
    return { success: true, data: toCamelCase(result.rows[0]) };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Could not create notification" };
  }
}

async function getNotificationsByProjectId(projectId) {
  const result = await pool.query(`SELECT * FROM notifications WHERE project_id = $1`, [projectId]);
  return result.rows.map(toCamelCase);
}

async function findNotificationById(id) {
  const result = await pool.query(`SELECT * FROM notifications WHERE id = $1`, [id]);
  if (result.rows.length === 0) {
    return { success: false, message: "Notification not found" };
  }
  return { success: true, data: toCamelCase(result.rows[0]) };
}

async function updateNotification(id, updates) {
  const result = await pool.query(
    `UPDATE notifications SET destination = $1, enabled = $2, updated_at = $3 WHERE id = $4 RETURNING *`,
    [updates.destination, updates.enabled, new Date(), id]
  );
  if (result.rows.length === 0) {
    return { success: false, message: "Notification not found" };
  }
  return { success: true, data: toCamelCase(result.rows[0]) };
}

async function deleteNotification(id) {
  await pool.query(`DELETE FROM notifications WHERE id = $1`, [id]);
  return { success: true };
}

async function recordDelivery(delivery) {
  await pool.query(
    `INSERT INTO notification_deliveries (id, notification_id, event_id, status, attempted_at, error) VALUES ($1, $2, $3, $4, $5, $6)`,
    [delivery.id, delivery.notificationId, delivery.eventId, delivery.status, delivery.attemptedAt, delivery.error]
  );
}

module.exports = { createNotification, getNotificationsByProjectId, findNotificationById, updateNotification, deleteNotification, recordDelivery };