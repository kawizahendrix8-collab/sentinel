const projectStore = require("../database/projectStore.js");

async function verifyApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ success: false, message: "No API key provided" });
  }

  const result = await projectStore.findProjectByApiKey(apiKey);

  if (!result.success) {
    return res.status(401).json({ success: false, message: "Invalid API key" });
  }

  req.project = result.data;
  next();
}

module.exports = verifyApiKey;
