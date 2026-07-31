let events = [];

function addEvent(event) {
  events.push(event);
}

function getAllEvents() {
  return events;
}

function updateEvent(id, updates) {

  const index = events.findIndex(function(event) {
    return event.id === id;
  });

  if (index === -1) {
    return {
      "success": false,
      "message": "Event not Found"
    }
  }

  const event = events[index];

  event.status = updates.status;
if (updates.retryCount !== undefined) {
  event.retryCount = updates.retryCount;
}
  return { success: true, data: event };

}


module.exports = { addEvent, getAllEvents ,updateEvent};
