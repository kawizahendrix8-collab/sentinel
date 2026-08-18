const subscriptionService = require("../services/subscriptionService");

async function getSubscription(req, res, next) {
  try {
    const subscription = await subscriptionService.getSubscription(
      req.user.id
    );

    res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    next(error);
  }
}

async function getPlans(req, res, next) {
  try {
    const plans = subscriptionService.getAllPlans();

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    next(error);
  }
}

async function changePlan(req, res, next) {
  try {
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Plan is required"
      });
    }

    const subscription =
      await subscriptionService.changePlan(
        req.user.id,
        plan
      );

    res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    next(error);
  }
}

async function cancelSubscription(req, res, next) {
  try {
    const subscription =
      await subscriptionService.cancelSubscription(
        req.user.id
      );

    res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    next(error);
  }
}

async function getUsage(req, res, next) {
  try {
    const usage =
      await subscriptionService.getUsage(
        req.user.id
      );

    res.json({
      success: true,
      data: usage
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSubscription,
  getPlans,
  changePlan,
  cancelSubscription,
  getUsage
};
