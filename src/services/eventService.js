const eventStore = require("../database/eventStore.js");

function createEvent(data) {
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

module.exports = { createEvent, getEvents };