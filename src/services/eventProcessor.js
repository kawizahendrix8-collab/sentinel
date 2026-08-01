const eventLogger = require("./eventLogger.js");
const eventService = require("./eventService.js");
const eventStore = require("../database/eventStore.js");

async function processEvent(id) {
  const result = await eventService.getEventById(id);

  if (!result.success) {
    return { success: false, message: "Event not found" };
  }

  if (result.data.payload.simulateFailure === true) {
    const newRetryCount = result.data.retryCount + 1;

    eventLogger.logHistory(result.data, "Processing failed");

    if (newRetryCount >= result.data.maxRetries) {
      return await eventStore.updateEvent(id, { status: "permanently_failed", retryCount: newRetryCount, history: result.data.history });
    } else {
      eventLogger.logHistory(result.data, "Retry attempt #" + newRetryCount);
      return await eventStore.updateEvent(id, { status: "retrying", retryCount: newRetryCount, history: result.data.history });
    }
  } else {
    eventLogger.logHistory(result.data, "Processing started");
    await eventStore.updateEvent(id, { status: "processing", history: result.data.history });
    eventLogger.logHistory(result.data, "Processing completed");
    return await eventStore.updateEvent(id, { status: "completed", history: result.data.history });
  }
}

module.exports = { processEvent };