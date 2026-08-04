const pool = require("./db.js");



function toCamelCase(row) {
  return {
    id: row.id,
    source: row.source,
    type: row.type,
    status: row.status,
    retryCount: row.retry_count,
    projectId: row.project_id,
    maxRetries: row.max_retries,
    payload: row.payload,
    history: row.history,
    receivedAt: row.received_at
  };
}

async function addEvent(event) {
  try {
    await pool.query(`
      INSERT INTO events (id, source, type, status, retry_count, project_id,max_retries, payload, history, received_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10)
    `, [event.id, event.source, event.type, event.status, event.retryCount,event.projectId, event.maxRetries, JSON.stringify(event.payload), JSON.stringify(event.history), event.receivedAt]);
  } catch (err) {
    console.log(err);
  }
}

async function getAllEvents() {
  const result = await pool.query(`SELECT * FROM events`);
  return result.rows.map(toCamelCase);
}

async function updateEvent(id, updates) {
  if (updates.retryCount !== undefined) {
    const result = await pool.query(
      `UPDATE events SET status = $1, retry_count = $2, history = $3 WHERE id = $4 RETURNING *`,
      [updates.status, updates.retryCount, JSON.stringify(updates.history), id]
    );
    if (result.rows.length === 0) {
      return { success: false, message: "Event not Found" };
    }
    return { success: true, data: toCamelCase(result.rows[0]) };
  } else {
    const result = await pool.query(
      `UPDATE events SET status = $1, history = $2 WHERE id = $3 RETURNING *`,
      [updates.status, JSON.stringify(updates.history), id]
    );
    if (result.rows.length === 0) {
      return { success: false, message: "Event not Found" };
    }
    return { success: true, data: toCamelCase(result.rows[0]) };
  }
}

module.exports = { addEvent, getAllEvents, updateEvent };