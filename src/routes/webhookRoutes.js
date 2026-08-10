const express = require("express");
const router = express.Router();

const { handleWebhook } = require("../controllers/webhookController.js");

router.post("/:provider/:projectId", handleWebhook);

module.exports = router;