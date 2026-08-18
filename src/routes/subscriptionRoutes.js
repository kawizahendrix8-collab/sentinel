const express = require("express");

const router = express.Router();

const subscriptionController =
  require("../controllers/subscriptionController");

const authMiddleware =
  require("../middleware/authMiddleware");

// Public
router.get(
  "/plans",
  subscriptionController.getPlans
);

// Authenticated
router.get(
  "/",
  authMiddleware,
  subscriptionController.getSubscription
);

router.get(
  "/usage",
  authMiddleware,
  subscriptionController.getUsage
);

router.patch(
  "/plan",
  authMiddleware,
  subscriptionController.changePlan
);

router.post(
  "/cancel",
  authMiddleware,
  subscriptionController.cancelSubscription
);

module.exports = router;
