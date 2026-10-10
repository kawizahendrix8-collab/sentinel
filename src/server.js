require("./workers/eventWorker.js");

const express = require("express");

const app = express();

const eventRoutes = require("./routes/eventRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const projectRoutes = require("./routes/projectRoutes.js");
const webhookRoutes = require("./routes/webhookRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes.js");
const healthRoutes = require("./routes/healthRoutes.js");
const errorHandler = require("./middleware/errorHandler.js");

const rateLimiter = require("./middleware/rateLimiter.js");


app.use(express.json());
app.use("/health", healthRoutes);
app.use(rateLimiter);

app.use("/events", eventRoutes);
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/webhooks", webhookRoutes);
app.use("/notifications", notificationRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("we are online");
});