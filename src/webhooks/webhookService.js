const projectStore = require("../database/projectStore.js");
const webhookVerifier = require("./webhookVerifier.js");
const eventService = require("../services/eventService.js");


async function handleWebhook(provider, projectId, payload, rawPayload, signature) {

  const project = await projectStore.findProjectById(projectId);

  if (!project.success) {
    return { success: false, message: "Project not found" };
  }

  const isValid = webhookVerifier.verifySignature(rawPayload, signature, project.data.webhookSecret);

  if (!isValid) {
    return { success: false, message: "Invalid signature" };
  }

  const providerEventId = payload.id;

  if (providerEventId) {
    const existing = await eventService.getEvents({ providerEventId: providerEventId });
    if (existing.length > 0) {
      return { success: false, message: "Duplicate event, ignored" };
    }
  }


const eventData = {
  source: provider,
  type: payload.type || "webhook.received",
  payload: payload,
  providerEventId: providerEventId
};
  
  return await eventService.createEvent(eventData, projectId);
}

module.exports = { handleWebhook };