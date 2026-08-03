const pool = require("./db.js");

function toCamelCase(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    apiKey: row.api_key,
    createdAt: row.created_at
  };
}

async function createProject(project) {
  try {
    const result = await pool.query(
      `INSERT INTO projects (id, user_id, name, api_key, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [project.id, project.userId, project.name, project.apiKey, project.createdAt]
    );
    return { success: true, data: toCamelCase(result.rows[0]) };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Could not create project" };
  }
}

async function findProjectById(id) {
  const result = await pool.query(`SELECT * FROM projects WHERE id = $1`, [id]);

  if (result.rows.length === 0) {
    return { success: false, message: "Project not found" };
  } else {
    return { success: true, data: toCamelCase(result.rows[0]) };
  }
}

async function findProjectByApiKey(apiKey) {
  const result = await pool.query(`SELECT * FROM projects WHERE api_key = $1`, [apiKey]);

  if (result.rows.length === 0) {
    return { success: false, message: "Invalid API key" };
  } else {
    return { success: true, data: toCamelCase(result.rows[0]) };
  }
}

async function getProjectsByUserId(userId) {
  const result = await pool.query(`SELECT * FROM projects WHERE user_id = $1`, [userId]);
  return result.rows.map(toCamelCase);
}

module.exports = { createProject, findProjectById, findProjectByApiKey, getProjectsByUserId };