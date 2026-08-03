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

  const newProject = {
    id: id,
    userId: userId,
    name: data.name,
    apiKey: apiKey,
    createdAt: new Date()
  };

  return await projectStore.createProject(newProject);
}


async function getProjects(userId) {
  return await projectStore.getProjectsByUserId(userId);
}


async function getProjectById(id, userId) {
  const result = await projectStore.findProjectById(id);

  if (!result.success) {
    return result;
  }

  if (result.data.userId !== userId) {
    return { success: false, message: "Not authorized to view this project" };
  }

  return result;
}


module.exports = { createProject, getProjects, getProjectById };