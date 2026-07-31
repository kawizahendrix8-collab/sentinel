const eventLogger = require("./eventLogger.js");
const eventService = require("./eventService.js");
const eventStore = require("../database/eventStore.js");

function processEvent(id) {
  const result = eventService.getEventById(id);

  if (!result.success) {
    return { success: false, message: "Event not found" };
  }

  if (result.data.payload.simulateFailure === true) {
    const newRetryCount = result.data.retryCount + 1;

    eventLogger.logHistory(result.data, "Processing failed");

    if (newRetryCount >= result.data.maxRetries) {
      return eventStore.updateEvent(id, { status: "permanently_failed", retryCount: newRetryCount });
    } else {
      eventLogger.logHistory(result.data, "Retry attempt #" + newRetryCount);
      return eventStore.updateEvent(id, { status: "retrying", retryCount: newRetryCount });
    }
  } else {
    eventLogger.logHistory(result.data, "Processing started");
    eventStore.updateEvent(id, { status: "processing" });
    eventLogger.logHistory(result.data, "Processing completed");
    return eventStore.updateEvent(id, { status: "completed" });
  }
}

module.exports = { processEvent };