const eventLogger = require("./eventLogger.js");
const eventService = require("./eventService.js");
const eventStore = require("../database/eventStore.js");
const notificationService = require("./notificationService.js");
const projectStore = require("../database/projectStore.js");

async function processEvent(id, attemptNumber, maxAttempts) {
  const result = await eventService.getEventById(id);

  if (!result.success) {
    throw new Error("Event not found");
  }

  const event = result.data;

  try {
    eventLogger.logHistory(event, "Processing started");

    eventLogger.logHistory(event, "Processing completed");

    return await eventStore.updateEvent(id, {
      status: "completed",
      history: event.history
    });
  } catch (error) {
    eventLogger.logHistory(event, "Processing failed");

    const finalAttempt = attemptNumber >= maxAttempts;

    await eventStore.updateEvent(id, {
      status: finalAttempt ? "permanently_failed" : "retrying",
      retryCount: attemptNumber,
      history: event.history
    });

    if (finalAttempt) {
      const project = await projectStore.findProjectById(event.projectId);

      if (project.success) {
        try {
          await notificationService.triggerFailureNotifications(
            {
              ...event,
              status: "permanently_failed",
              retryCount: attemptNumber,
              history: event.history
            },
            project.data
          );
        } catch (err) {
          console.log("Notification trigger failed:", err.message);
        }
      }
    }

    throw error;
  }
}

module.exports = { processEvent };
