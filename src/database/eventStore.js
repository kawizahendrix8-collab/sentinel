let events = [];

function addEvent(event) {
  events.push(event);
}

function getAllEvents() {
  return events;
}

module.exports = { addEvent, getAllEvents };
