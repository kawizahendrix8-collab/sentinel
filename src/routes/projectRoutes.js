const express = require("express");
const router = express.Router();

const { createProject, getProjects, getProjectById } = require("../controllers/projectController.js");
const verifyToken = require("../middleware/authMiddleware.js");
const validateRequest = require("../middleware/validateRequest.js");

router.post("/", verifyToken, validateRequest(["name"]), createProject);
router.get("/", verifyToken, getProjects);
router.get("/:id", verifyToken, getProjectById);

module.exports = router;