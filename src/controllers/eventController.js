const eventProcessor = require("../services/eventProcessor.js");

const eventService = require("../services/eventService.js");

  async function createEvent(req, res) {
  const data = req.body;

  const projectId = req.project.id;
  const userId = req.project.userId;

  const newEvent = await eventService.createEvent(data, projectId, userId);

  if (!newEvent.success && newEvent.code === "DUPLICATE_EVENT") {
    return res.status(409).json(newEvent);
  }

  if (!newEvent.success) {
    return res.status(400).json(newEvent);
  }

  return res.status(201).json(newEvent);
}

async function getEvents(req,res){
  
  const events = await
    eventService.getEvents()

  res.json(events);
}

 async function getEventById(req,res){
  const id = req.params.id;

  const result =  await   eventService.getEventById(id);
  
  res.json(result);
}



 async function processEvent(req,res){
  const id = req.params.id;
  
  const result = await eventProcessor.processEvent(id);

  res.json(result);
    
}

 async function getEventHistory(req,res){

  const id = req.params.id;

  const result = await eventService.getEventHistory(id);

  res.json(result);
  
}

module.exports = {createEvent,getEvents,getEventById,processEvent,getEventHistory};
