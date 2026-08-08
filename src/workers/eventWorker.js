const eventService = require("../services/eventService.js");
const { Worker } = require("bullmq");

const eventProcessor = require("../services/eventProcessor.js");

const worker = new Worker(
  "event-processing",
  async job => {

    const eventId = job.data.eventId;

    const result = await eventService.getEventById(eventId);

    if (!result.success) {
      throw new Error("Event not found");
    }

    const processResult = await eventProcessor.processEvent(eventId);

    if (processResult.data.status === "retrying") {
      throw new Error("Event processing failed, retrying");
    }

  },
  {
    connection: {
      host: "localhost",
      port: 6379
    }
  }
);

worker.on("failed", (job, error) => {
  console.log("Job failed:", error.message);
});