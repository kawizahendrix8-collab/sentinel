const eventLogger = require("./eventLogger.js");
const eventService = require("./eventService.js");
const eventStore = require("../database/eventStore.js");
const notificationService = require("./notificationService.js");
const projectStore = require("../database/projectStore.js");

async function processEvent(id) {
  const result = await eventService.getEventById(id);

  if (!result.success) {
    return { success: false, message: "Event not found" };
  }

  if (result.data.payload.simulateFailure === true) {
    const newRetryCount = result.data.retryCount + 1;

    eventLogger.logHistory(result.data, "Processing failed");

    if (newRetryCount >= result.data.maxRetries) {
      const updateResult = await eventStore.updateEvent(id, { status: "permanently_failed", retryCount: newRetryCount, history: result.data.history });

      const project = await projectStore.findProjectById(result.data.projectId);
      if (project.success) {
        try {
          await notificationService.triggerFailureNotifications(updateResult.data, project.data);
        } catch (err) {
          console.log("Notification trigger failed:", err.message);
        }
      }

      return updateResult;
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