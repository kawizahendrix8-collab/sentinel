
const express = require("express");

const app = express();

const eventRoutes = require("./routes/eventRoutes.js");

const authRoutes = require("./routes/authRoutes.js");

const projectRoutes = require("./routes/projectRoutes.js");


app.use(express.json());
app.use("/events", eventRoutes);
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);

app.listen(3000, () => {
  console.log("we are online");
});