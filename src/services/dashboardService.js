const dashboardStore = require("../database/dashboardStore.js");
const projectStore = require("../database/projectStore.js");

async function getStats(projectId) {
  const project = await projectStore.findProjectById(projectId);
  if (!project.success) {
    return { success: false, message: "Project not found" };
  }

  const totalEvents = await dashboardStore.getTotalEvents(projectId);
  const completed = await dashboardStore.getCompletedCount(projectId);
  const failed = await dashboardStore.getFailedCount(projectId);
  const retrying = await dashboardStore.getRetryingCount(projectId);

  return {
    totalEvents: totalEvents,
    completed: completed,
    retrying: retrying,
    failed: failed
  };
}

async function getRecent(projectId) {
  const project = await projectStore.findProjectById(projectId);
  if (!project.success) {
    return { success: false, message: "Project not found" };
  }
  return await dashboardStore.getRecentEvents(projectId);
}

async function getFailed(projectId) {
  const project = await projectStore.findProjectById(projectId);
  if (!project.success) {
    return { success: false, message: "Project not found" };
  }
  return await dashboardStore.getFailedEvents(projectId);
}

module.exports = { getStats, getRecent, getFailed };