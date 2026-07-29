
const eventStore = require("../database/eventStore.js");

function processEvent(id) {

  eventStore.updateEvent(id, "processing")


  return eventStore.updateEvent(id,"completed")
  
}

module.exports = { processEvent };