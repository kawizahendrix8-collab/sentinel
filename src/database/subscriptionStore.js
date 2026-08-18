const pool = require("./db");

async function createSubscription({
  id,
  userId,
  plan = "free",
  status = "active",
  currentPeriodStart = null,
  currentPeriodEnd = null
}) {
  const result = await pool.query(
    `
    INSERT INTO subscriptions (
      id,
      user_id,
      plan,
      status,
      current_period_start,
      current_period_end,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    RETURNING *
    `,
    [
      id,
      userId,
      plan,
      status,
      currentPeriodStart,
      currentPeriodEnd
    ]
  );

  return result.rows[0];
}

async function getSubscriptionByUserId(userId) {
  const result = await pool.query(
    `
    SELECT *
    FROM subscriptions
    WHERE user_id = $1
    LIMIT 1
    `,
    [userId]
  );

  return result.rows[0] || null;
}

async function updateSubscription(userId, updates) {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(updates)) {
    const columnMap = {
      plan: "plan",
      status: "status",
      currentPeriodStart: "current_period_start",
      currentPeriodEnd: "current_period_end"
    };

    const column = columnMap[key];

    if (!column) {
      continue;
    }

    fields.push(`${column} = $${index}`);
    values.push(value);
    index++;
  }

  if (fields.length === 0) {
    return getSubscriptionByUserId(userId);
  }

  fields.push("updated_at = NOW()");
  values.push(userId);

  const result = await pool.query(
    `
    UPDATE subscriptions
    SET ${fields.join(", ")}
    WHERE user_id = $${index}
    RETURNING *
    `,
    values
  );

  return result.rows[0] || null;
}

async function deleteSubscription(userId) {
  const result = await pool.query(
    `
    DELETE FROM subscriptions
    WHERE user_id = $1
    RETURNING *
    `,
    [userId]
  );

  return result.rows[0] || null;
}

async function createUsage({
  id,
  userId,
  periodStart,
  periodEnd,
  eventsUsed = 0
}) {
  const result = await pool.query(
    `
    INSERT INTO usage (
      id,
      user_id,
      period_start,
      period_end,
      events_used
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      id,
      userId,
      periodStart,
      periodEnd,
      eventsUsed
    ]
  );

  return result.rows[0];
}

async function getCurrentUsage(userId) {
  const result = await pool.query(
    `
    SELECT *
    FROM usage
    WHERE user_id = $1
      AND period_start <= NOW()
      AND period_end >= NOW()
    ORDER BY period_start DESC
    LIMIT 1
    `,
    [userId]
  );

  return result.rows[0] || null;
}

async function incrementUsage(userId, amount = 1) {
  const result = await pool.query(
    `
    UPDATE usage
    SET events_used = events_used + $1
    WHERE user_id = $2
      AND period_start <= NOW()
      AND period_end >= NOW()
    RETURNING *
    `,
    [amount, userId]
  );

  return result.rows[0] || null;
}

module.exports = {
  createSubscription,
  getSubscriptionByUserId,
  updateSubscription,
  deleteSubscription,
  createUsage,
  getCurrentUsage,
  incrementUsage
};
