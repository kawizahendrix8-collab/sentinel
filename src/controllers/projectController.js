const projectService = require("../services/projectService.js");

 async function createProject(req, res) {
  
  const data = req.body;
  const userId = req.user.id;

  const newProject = await projectService.createProject(data, userId);

  res.status(201).json(newProject);
  
}

 async  function getProjects(req, res) {


   const userId = req.user.id;

   const projects = await projectService.getProjects(userId);

   res.json(projects);

}

 async function getProjectById(req, res) {

  const id = req.params.id;
  const userId = req.user.id;

  const project = await projectService.getProjectById(id,userId);

   res.json(project);

}

module.exports = {createProject,getProjects,getProjectById};