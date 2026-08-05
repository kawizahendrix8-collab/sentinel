const dashboardService = require("../services/dashboardService.js");

 async function getStats(req, res) {

  const projectId = req.params.projectId;

const stats = await dashboardService.getStats(projectId);

  res.json(stats);

}


async function getRecent(req, res) {

  const projectId = req.params.projectId;

  
const recent = await dashboardService.getRecent(projectId);

  res.json(recent);
  
}

 async function getFailed(req, res) {

  const projectId = req.params.projectId;

  const failed = await 
   dashboardService.getFailed(projectId);

   res.json(failed);

}

module.exports = { getStats, getRecent, getFailed };