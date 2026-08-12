async function sendFailureEmail(recipient, event, project) {
  console.log("=== EMAIL NOTIFICATION ===");
  console.log("To:", recipient);
  console.log("Project:", project.name);
  console.log("Event ID:", event.id);
  console.log("Event Type:", event.type);
  console.log("Status:", event.status);
  console.log("Retry Count:", event.retryCount);
  console.log("==========================");

  return { success: true };
}

module.exports = { sendFailureEmail };