

  function logHistory(event, action) {
    
  const entry = {
    timestamp: new Date(),
    action: action
  };
  event.history.push(entry);
}

module.exports = { logHistory };