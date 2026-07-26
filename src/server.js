// Sentinel Core Service
// The first heartbeat of the reliability platform

require("dotenv").config();

const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());


// Health Check Endpoint
// Used to know if Sentinel is alive

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "sentinel",
    timestamp: new Date().toISOString()
  });
});


// Root Endpoint

app.get("/", (req, res) => {
  res.json({
    name: "Sentinel",
    message: "The reliability layer for modern software systems"
  });
});


// Start Server

app.listen(PORT, () => {
  console.log(`
=================================
 Sentinel Core Started
 Port: ${PORT}
 Environment: ${process.env.NODE_ENV || "development"}
=================================
  `);
});
