const crypto = require("crypto");

const plans = require("../config/plans");
const pesapalService = require("./pesapalService");
const paymentStore = require("../database/paymentStore");

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${crypto
    .randomBytes(4)
    .toString("hex")}`;
}

function validatePlan(plan) {
  if (!plans[plan]) {
    const error = new Error(`Invalid plan: ${plan}`);
    error.statusCode = 400;
    throw error;
  }

  if (plan === "free") {
    const error = new Error(
      "Free plan does not require payment"
    );
    error.statusCode = 400;
    throw error;
  }
}

async function createPaymentOrder({
  userId,
  email,
  name,
  phone,
  plan
}) {
  validatePlan(plan);

  const selectedPlan = plans[plan];

  const amount = selectedPlan.price;
  const currency = selectedPlan.currency;

  if (!amount || amount <= 0) {
    const error = new Error(
      "Price is not configured for this plan"
    );

    error.statusCode = 400;
    throw error;
  }

  const merchantReference = generateId("sentinel");

  const order = {
    id: merchantReference,
    currency,
    amount,
    description:
      `Sentinel ${selectedPlan.name} subscription`,
    callback_url:
      process.env.PESAPAL_CALLBACK_URL,
    notification_id:
      process.env.PESAPAL_NOTIFICATION_ID,

    billing_address: {
      email_address: email,
      phone_number: phone,
      first_name: name
    }
  };

  const response =
    await pesapalService.submitOrder(order);

  const orderTrackingId =
    response.order_tracking_id || null;

  const payment =
    await paymentStore.createPayment({
      id: generateId("pay"),
      userId,
      plan,
      amount,
      currency,
      merchantReference,
      orderTrackingId,
      status: "pending"
    });

  return {
    paymentId: payment.id,
    userId,
    plan,
    amount,
    currency,
    merchantReference,
    orderTrackingId,
    redirectUrl:
      response.redirect_url || null,
    status: "pending"
  };
}

module.exports = {
  createPaymentOrder
};