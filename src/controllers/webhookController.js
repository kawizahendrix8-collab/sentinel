const webhookService = require("../webhooks/webhookService.js");

async function handleWebhook(req, res) {
  const provider = req.params.provider;
  const projectId = req.params.projectId;
  const payload = req.body;
  const rawPayload = JSON.stringify(payload);
  const signature = req.headers["x-webhook-signature"];

  const result = await webhookService.handleWebhook(provider, projectId, payload, rawPayload, signature);

  res.json(result);
}

module.exports = { handleWebhook };