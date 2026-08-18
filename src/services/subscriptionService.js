const crypto = require("crypto");

const plans = require("../config/plans");
const subscriptionStore = require("../database/subscriptionStore");

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
}

function validatePlan(plan) {
  if (!plans[plan]) {
    const error = new Error(`Invalid plan: ${plan}`);
    error.statusCode = 400;
    throw error;
  }
}

async function createSubscription(userId, plan = "free") {
  validatePlan(plan);

  const existing = await subscriptionStore.getSubscriptionByUserId(userId);

  if (existing) {
    return existing;
  }

  const now = new Date();

  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const subscription = await subscriptionStore.createSubscription({
    id: generateId("sub"),
    userId,
    plan,
    status: "active",
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd
  });

  await subscriptionStore.createUsage({
    id: generateId("usage"),
    userId,
    periodStart: now,
    periodEnd,
    eventsUsed: 0
  });

  return subscription;
}

async function getSubscription(userId) {
  let subscription =
    await subscriptionStore.getSubscriptionByUserId(userId);

  if (!subscription) {
    subscription = await createSubscription(userId, "free");
  }

  return subscription;
}

async function changePlan(userId, plan) {
  validatePlan(plan);

  const subscription = await getSubscription(userId);

  return subscriptionStore.updateSubscription(userId, {
    plan,
    status: "active"
  });
}

async function cancelSubscription(userId) {
  const subscription = await getSubscription(userId);

  return subscriptionStore.updateSubscription(userId, {
    status: "canceled"
  });
}

function getPlan(plan) {
  validatePlan(plan);

  return plans[plan];
}

function getAllPlans() {
  return plans;
}

async function getUsage(userId) {
  return subscriptionStore.getCurrentUsage(userId);
}

async function incrementUsage(userId, amount = 1) {
  return subscriptionStore.incrementUsage(userId, amount);
}

async function canConsumeEvents(userId, amount = 1) {
  const subscription = await getSubscription(userId);
  const usage = await getUsage(userId);

  const plan = plans[subscription.plan];

  if (!plan) {
    return false;
  }

  const currentUsage = usage ? usage.events_used : 0;

  return currentUsage + amount <= plan.eventLimit;
}

module.exports = {
  createSubscription,
  getSubscription,
  changePlan,
  cancelSubscription,
  getPlan,
  getAllPlans,
  getUsage,
  incrementUsage,
  canConsumeEvents
};
