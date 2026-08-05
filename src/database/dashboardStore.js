const pool = require("./db.js");

const { toCamelCase } = require("./eventStore.js");

async function getTotalEvents(projectId) {
  const result = await pool.query(`SELECT COUNT(*) FROM events WHERE project_id = $1`, [projectId]);
  return parseInt(result.rows[0].count);
}

async function getCompletedCount(projectId) {
  const result = await pool.query(`SELECT COUNT(*) FROM events WHERE project_id = $1 AND status = 'completed'`, [projectId]);
  return parseInt(result.rows[0].count);
}

async function getFailedCount(projectId) {
  const result = await pool.query(`SELECT COUNT(*) FROM events WHERE project_id = $1 AND status = 'permanently_failed'`, [projectId]);
  return parseInt(result.rows[0].count);
}

async function getRetryingCount(projectId) {
  const result = await pool.query(`SELECT COUNT(*) FROM events WHERE project_id = $1 AND status = 'retrying'`, [projectId]);
  return parseInt(result.rows[0].count);
}

async function getRecentEvents(projectId) {
  const result = await pool.query(`SELECT * FROM events WHERE project_id = $1 ORDER BY received_at DESC LIMIT 10`, [projectId]);
  return result.rows.map(toCamelCase);
}

async function getFailedEvents(projectId) {
  const result = await pool.query(`SELECT * FROM events WHERE project_id = $1 AND status = 'permanently_failed'`, [projectId]);
  return result.rows.map(toCamelCase);
}

module.exports = { getTotalEvents, getCompletedCount, getFailedCount, getRetryingCount, getRecentEvents, getFailedEvents };