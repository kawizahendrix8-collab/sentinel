const pool = require("./db");

async function createPayment({
  id,
  userId,
  plan,
  amount,
  currency = "USD",
  merchantReference,
  orderTrackingId = null,
  status = "pending"
}) {
  const result = await pool.query(
    `
    INSERT INTO payments (
      id,
      user_id,
      plan,
      amount,
      currency,
      merchant_reference,
      order_tracking_id,
      status,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
    RETURNING *
    `,
    [
      id,
      userId,
      plan,
      amount,
      currency,
      merchantReference,
      orderTrackingId,
      status
    ]
  );

  return result.rows[0];
}

async function getPaymentById(id) {
  const result = await pool.query(
    `
    SELECT *
    FROM payments
    WHERE id = $1
    LIMIT 1
    `,
    [id]
  );

  return result.rows[0] || null;
}

async function getPaymentByMerchantReference(
  merchantReference
) {
  const result = await pool.query(
    `
    SELECT *
    FROM payments
    WHERE merchant_reference = $1
    LIMIT 1
    `,
    [merchantReference]
  );

  return result.rows[0] || null;
}

async function getPaymentByTrackingId(
  orderTrackingId
) {
  const result = await pool.query(
    `
    SELECT *
    FROM payments
    WHERE order_tracking_id = $1
    LIMIT 1
    `,
    [orderTrackingId]
  );

  return result.rows[0] || null;
}

async function updatePayment(id, updates) {
  const fields = [];
  const values = [];
  let index = 1;

  const columnMap = {
    status: "status",
    orderTrackingId: "order_tracking_id"
  };

  for (const [key, value] of Object.entries(updates)) {
    const column = columnMap[key];

    if (!column) {
      continue;
    }

    fields.push(`${column} = $${index}`);
    values.push(value);
    index++;
  }

  if (fields.length === 0) {
    return getPaymentById(id);
  }

  fields.push("updated_at = NOW()");
  values.push(id);

  const result = await pool.query(
    `
    UPDATE payments
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
    `,
    values
  );

  return result.rows[0] || null;
}

module.exports = {
  createPayment,
  getPaymentById,
  getPaymentByMerchantReference,
  getPaymentByTrackingId,
  updatePayment
};
