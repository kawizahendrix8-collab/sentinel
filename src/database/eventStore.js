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

async function getAllEvents(filters) {
  let conditions = [];
  let values = [];

  if (filters.status) {
    values.push(filters.status);
    conditions.push(`status = $${values.length}`);
  }

  if (filters.source) {
    values.push(filters.source);
    conditions.push(`source = $${values.length}`);
  }

  if (filters.type) {
    values.push(filters.type);
    conditions.push(`type = $${values.length}`);
  }

  if (filters.projectId) {
    values.push(filters.projectId);
    conditions.push(`project_id = $${values.length}`);
  }

  let query = `SELECT * FROM events`;

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  if (filters.sort === "oldest") {
  query += ` ORDER BY received_at ASC`;
} else {
  query += ` ORDER BY received_at DESC`;
}

  if (filters.limit) {
  values.push(filters.limit);
  query += ` LIMIT $${values.length}`;
}

if (filters.offset) {
  values.push(filters.offset);
  query += ` OFFSET $${values.length}`;
}

  const result = await pool.query(query, values);
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

module.exports = { addEvent, getAllEvents, updateEvent,toCamelCase };