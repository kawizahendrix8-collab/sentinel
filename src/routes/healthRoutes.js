const express = require("express");
const pool = require("../database/db.js");
const { Queue } = require("bullmq");

const router = express.Router();

const redis = new Queue("health-check", {
  connection: {
    host: "localhost",
    port: 6379
  }
});

router.get("/", (req, res) => {
  res.json({
    success: true,
    status: "healthy"
  });
});

router.get("/ready", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    await redis.client;

    res.json({
      success: true,
      status: "ready",
      database: "connected",
      redis: "connected"
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: "not_ready",
      message: "Dependency check failed"
    });
  }
});

module.exports = router;
