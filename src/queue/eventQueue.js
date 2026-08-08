const { Queue } = require("bullmq");

const eventQueue = new Queue("event-processing", {
  connection: {
    host: "localhost",
    port: 6379
  }
});


module.exports = eventQueue;