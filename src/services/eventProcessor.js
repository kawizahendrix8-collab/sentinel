const eventService = require("./eventService.js");
const eventStore = require("../database/eventStore.js");

function processEvent(id) {
  const result = eventService.getEventById(id);

  if (!result.success) {
    return { success: false, message: "Event not found" };
  }

  if (result.data.payload.simulateFailure === true) {
    const newRetryCount = result.data.retryCount + 1;

    if (newRetryCount >= result.data.maxRetries) {
      return eventStore.updateEvent(id, { status: "permanently_failed", retryCount: newRetryCount });
    } else {
      return eventStore.updateEvent(id, { status: "retrying", retryCount: newRetryCount });
    }
  } else {
    eventStore.updateEvent(id, { status: "processing" });
    return eventStore.updateEvent(id, { status: "completed" });
  }
}

module.exports = { processEvent };