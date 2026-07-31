

 const express = require("express");
const router = express.Router();

const {createEvent,getEvents,getEventById,processEvent,getEventHistory} = require("../controllers/eventController.js")


router.post("/",createEvent);
router.get("/",getEvents);
router.get("/:id",getEventById);
router.post("/:id/process", processEvent);
router.get("/:id/history", getEventHistory);

module.exports = router;