const authService = require("../services/authService.js");


async function register(req, res) {


  const data = req.body;
  const newUser = await authService.register(data);

  res.status(201).json(newUser);

}

async function login(req, res) {
  
  const data = req.body;
  const user = await  authService.login(data);

  res.json(user);


    

    }


module.exports = { register, login };