require("./workers/eventWorker.js");

const express = require("express");

const app = express();

const eventRoutes = require("./routes/eventRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const projectRoutes = require("./routes/projectRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const webhookRoutes = require("./routes/webhookRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes.js");
const errorHandler = require("./middleware/errorHandler.js");

const rateLimiter = require("./middleware/rateLimiter.js");


app.use(express.json());
app.use("/events", eventRoutes);
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/webhooks", webhookRoutes);
app.use("/notifications", notificationRoutes);
app.use(rateLimiter);
app.use(errorHandler);

app.listen(3000, () => {
  console.log("we are online");
});