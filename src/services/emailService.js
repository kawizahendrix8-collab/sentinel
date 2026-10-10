async function sendFailureEmail(recipient, event, project) {
  return {
    success: false,
    message: "Email delivery is not configured"
  };
}

module.exports = { sendFailureEmail };
