const { Worker } = require("bullmq");
const eventProcessor = require("../services/eventProcessor.js");

const worker = new Worker(
  "event-processing",
  async job => {
    const eventId = job.data.eventId;

    await eventProcessor.processEvent(eventId, job.attemptsMade + 1, job.opts.attempts);
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
