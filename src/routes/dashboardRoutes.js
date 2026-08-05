const express = require("express");
const router = express.Router();

const { getStats, getRecent, getFailed } = require("../controllers/dashboardController.js");
const verifyToken = require("../middleware/authMiddleware.js");

router.get("/:projectId/stats", verifyToken, getStats);
router.get("/:projectId/recent", verifyToken, getRecent);
router.get("/:projectId/failed", verifyToken, getFailed);

module.exports = router;