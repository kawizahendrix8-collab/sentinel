const projectStore = require("../database/projectStore.js");
const crypto = require("crypto");


async function createProject(data, userId) {

  if (!data.name) {
    return {
      success: false,
      message: "name is required"
    };
  }

  const id = "proj_" + Date.now();
  const apiKey = crypto.randomBytes(32).toString("hex");
const webhookSecret = "whsec_" + crypto.randomBytes(32).toString("hex");
  
  const newProject = {
    id: id,
    userId: userId,
    name: data.name,
    apiKey: apiKey,
    webhookSecret: webhookSecret,
    createdAt: new Date()
  };

  return await projectStore.createProject(newProject);
}


async function getProjects(userId) {
  const projects = await projectStore.getProjectsByUserId(userId);

  return projects.map(function(project) {
    return {
      id: project.id,
      userId: project.userId,
      name: project.name,
      apiKey: maskSecret(project.apiKey),
      webhookSecret: maskSecret(project.webhookSecret),
      createdAt: project.createdAt
    };
  });
}

async function getProjectById(id, userId) {
  const result = await projectStore.findProjectById(id);

  if (!result.success) {
    return result;
  }

  if (result.data.userId !== userId) {
    return { success: false, message: "Not authorized to view this project" };
  }

  return {
    success: true,
    data: {
      id: result.data.id,
      userId: result.data.userId,
      name: result.data.name,
      apiKey: maskSecret(result.data.apiKey),
      webhookSecret: maskSecret(result.data.webhookSecret),
      createdAt: result.data.createdAt
    }
  };
}

function maskSecret(secret) {
  if (!secret) {
    return null;
  }

  const lastFour = secret.slice(-4);

  return "••••••••" + lastFour;
}

module.exports = { createProject, getProjects, getProjectById,maskSecret };