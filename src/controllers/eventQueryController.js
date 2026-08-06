const eventQueryService = require("../services/eventQueryService.js");

async function getEvents(req, res) {
  const filters = req.query;
  const events = await eventQueryService.getEvents(filters);
  res.json(events);
}

module.exports = { getEvents };