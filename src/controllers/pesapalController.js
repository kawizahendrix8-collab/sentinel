const pesapalService = require("../services/pesapalService");
const paymentStore = require("../database/paymentStore");
const subscriptionService = require("../services/subscriptionService");

async function processPayment(orderTrackingId, merchantReference) {
  const transaction =
    await pesapalService.getTransactionStatus(
      orderTrackingId
    );

  const payment =
    await paymentStore.getPaymentByTrackingId(
      orderTrackingId
    );

  if (!payment && merchantReference) {
    const paymentByReference =
      await paymentStore.getPaymentByMerchantReference(
        merchantReference
      );

    if (paymentByReference) {
      return await finalizePayment(
        paymentByReference,
        transaction
      );
    }
  }

  if (!payment) {
    const error = new Error(
      "Payment record not found"
    );

    error.statusCode = 404;
    throw error;
  }

  return await finalizePayment(
    payment,
    transaction
  );
}

async function finalizePayment(
  payment,
  transaction
) {
  const status =
    String(
      transaction.payment_status_description || ""
    ).toLowerCase();

  if (
    status === "completed" ||
    status === "paid" ||
    status === "success"
  ) {
    if (payment.status !== "completed") {
      await paymentStore.updatePayment(
        payment.id,
        {
          status: "completed"
        }
      );

      await subscriptionService.changePlan(
        payment.user_id,
        payment.plan
      );
    }
  } else if (
    status === "failed" ||
    status === "reversed" ||
    status === "cancelled"
  ) {
    if (payment.status !== "failed") {
      await paymentStore.updatePayment(
        payment.id,
        {
          status: "failed"
        }
      );
    }
  }

  return {
    payment,
    transaction
  };
}

async function handleCallback(req, res, next) {
  try {
    const {
      OrderTrackingId,
      OrderMerchantReference
    } = req.query;

    if (!OrderTrackingId) {
      return res.status(400).json({
        success: false,
        message: "OrderTrackingId is required"
      });
    }

    const result =
      await processPayment(
        OrderTrackingId,
        OrderMerchantReference
      );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function handleIPN(req, res, next) {
  try {
    const {
      OrderTrackingId,
      OrderMerchantReference
    } = req.query;

    if (!OrderTrackingId) {
      return res.status(400).json({
        success: false,
        message: "OrderTrackingId is required"
      });
    }

    const result =
      await processPayment(
        OrderTrackingId,
        OrderMerchantReference
      );

    res.json({
      success: true,
      message: "IPN received",
      data: result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleCallback,
  handleIPN
};
