const plans = {
  free: {
    name: "Free",
    price: 0,
    currency: "USD",
    billingInterval: "month",
    eventLimit: 1000,
    projectLimit: 1,
    features: [
      "basic_history",
      "basic_notifications"
    ]
  },

  starter: {
    name: "Starter",
    price: 49,
    currency: "USD",
    billingInterval: "month",
    eventLimit: 10000,
    projectLimit: 5,
    features: [
      "event_filtering",
      "email_notifications",
      "webhook_notifications",
      "basic_analytics"
    ]
  },

  pro: {
    name: "Pro",
    price: 99,
    currency: "USD",
    billingInterval: "month",
    eventLimit: 100000,
    projectLimit: 20,
    features: [
      "advanced_filtering",
      "email_notifications",
      "webhook_notifications",
      "advanced_analytics",
      "priority_support"
    ]
  },

  business: {
    name: "Business",
    price: 149,
    currency: "USD",
    billingInterval: "month",
    eventLimit: 1000000,
    projectLimit: null,
    features: [
      "advanced_notifications",
      "advanced_analytics",
      "priority_support"
    ]
  }
};

module.exports = plans;