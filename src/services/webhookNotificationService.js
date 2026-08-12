async function sendFailureWebhook(url, event, project) {
  const payload = {
    eventId: event.id,
    projectId: project.id,
    eventType: event.type,
    source: event.source,
    status: event.status,
    retryCount: event.retryCount,
    timestamp: new Date()
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return { success: false, message: "Webhook endpoint returned an error" };
    }

    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

module.exports = { sendFailureWebhook };