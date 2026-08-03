const express = require("express");
const router = express.Router();

const { createProject, getProjects, getProjectById } = require("../controllers/projectController.js");
const verifyToken = require("../middleware/authMiddleware.js");

router.post("/", verifyToken, createProject);
router.get("/", verifyToken, getProjects);
router.get("/:id", verifyToken, getProjectById);

module.exports = router;