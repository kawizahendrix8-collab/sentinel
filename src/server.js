 const express = require("express");

const app = express();

const eventRoutes = require("./routes/eventRoutes.js");

app.use(express.json());
app.use("/events", eventRoutes);

app.listen(3000, () => {
  console.log("we are online");
});