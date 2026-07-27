
const eventService = require("../services/eventService.js");

function createEvent(req, res) {
  const data = req.body;
  
  const newEvent = eventService.createEvent(data);

  res.status(201).json(newEvent);

};

function getEvents(req,res){
  
  const events = eventService.getEvents()

  res.json(events);
}

module.exports = {createEvent,getEvents};