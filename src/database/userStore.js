
const pool = require("./db.js");

  async function createUser(user) {
  try {
    const result = await pool.query(
      `INSERT INTO users (id, name, email, password, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user.id, user.name, user.email, user.password, user.createdAt]
    );
    return { success: true, data: result.rows[0] };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Could not create user" };
  }
  }




 async  function findUserByEmail(email) {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

   if (result.rows.length === 0) {
  return { success: false, message: "Account not found" };
} else {
  return { success: true, data: result.rows[0] };
}

}


  async function findUserById(id) {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

  if (result.rows.length === 0) {
    return { success: false, message: "User not found" };
  } else {
    return { success: true, data: result.rows[0] };
  }
}

  
  



module.exports = { createUser, findUserByEmail, findUserById };