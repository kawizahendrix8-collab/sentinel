const eventProcessor = require("../services/eventProcessor.js");

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

function getEventById(req,res){
  const id = req.params.id;

  const result = eventService.getEventById(id);
  
  res.json(result);
}



function processEvent(req,res){
  const id = req.params.id;
  
  const result = eventProcessor.processEvent(id);

  res.json(result);
    
}

function getEventHistory(req,res){

  const id = req.params.id;

  const result = eventService.getEventHistory(id);

  res.json(result);
  
}

module.exports = {createEvent,getEvents,getEventById,processEvent,getEventHistory};