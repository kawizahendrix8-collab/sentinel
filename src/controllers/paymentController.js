const paymentService = require("../services/paymentService");

async function createPayment(req, res, next) {
  try {
    const {
      plan,
      phone
    } = req.body;

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Plan is required"
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required"
      });
    }

    const payment =
      await paymentService.createPaymentOrder({
        userId: req.user.id,
        email: req.user.email,
        name: req.user.name,
        phone,
        plan
      });

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPayment
};
