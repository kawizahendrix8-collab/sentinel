
const eventStore = require("../database/eventStore.js");


async function getEvents(filters) {
  if (filters.limit) {
    filters.limit = parseInt(filters.limit);
  }
  if (filters.offset) {
    filters.offset = parseInt(filters.offset);
  }

  return await eventStore.getAllEvents(filters);
}

module.exports = { getEvents };