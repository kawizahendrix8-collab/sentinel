

 const express = require("express");
const router = express.Router();

const {createEvent,getEvents,getEventById,processEvent,getEventHistory} = require("../controllers/eventController.js")

const verifyToken = require("../middleware/authMiddleware.js");

const verifyApiKey = require("../middleware/apiKeyMiddleware.js");
router.post("/", verifyApiKey, createEvent);
router.get("/", verifyToken, getEvents);
router.get("/:id",getEventById);
router.post("/:id/process", processEvent);
router.get("/:id/history", getEventHistory);

module.exports = router;