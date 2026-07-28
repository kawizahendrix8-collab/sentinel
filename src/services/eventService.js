
const eventStore = require("../database/eventStore.js");

function createEvent(data) {
  
  if (!data.source) {
return {
  "success": false,
  "message": "source is required"
}  
  }

  if(!data.type){
    return  {
      "success":false,
      "message":"type is required"
    }
  } 

  if(!data.payload) {
    return {
      "success":false,
      "message":"payload is required"
    }
  }

  const newEvent = {
    id: "evt_" + Date.now(),
    source: data.source,
    type: data.type,
    payload: data.payload,
    status: "received",
    receivedAt: new Date()
  };
  
  eventStore.addEvent(newEvent);

  return newEvent;
};

function getEvents() {
  return eventStore.getAllEvents();
}

function getEventById(id) {
  
const events = eventStore.getAllEvents();

const foundEvent = events.find(function(event) {
  return event.id === id;
});

  if (foundEvent) {
  return { success: true,
          data: foundEvent 
         };
    } else {
  return { success: false, message: "Event not found" };
  }
  
  }


module.exports = { createEvent, getEvents,getEventById };