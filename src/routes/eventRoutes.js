

 const express = require("express");
const router = express.Router();

const {createEvent,getEvents} = require("../controllers/eventController.js")


router.post("/",createEvent);
router.get("/",getEvents);

module.exports = router;