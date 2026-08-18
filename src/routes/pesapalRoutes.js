const express = require("express");

const router = express.Router();

const pesapalController =
  require("../controllers/pesapalController");

router.get(
  "/callback",
  pesapalController.handleCallback
);

router.get(
  "/ipn",
  pesapalController.handleIPN
);

module.exports = router;
