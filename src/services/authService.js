const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/token.js");

const userStore = require("../database/userStore.js");


async function register(data) {

  const existingUser = await userStore.findUserByEmail(data.email);

  if (existingUser.success) {
    return {
      "success": false,
      "message": "Email already registered"
    };
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = {
    id: "user_" + Date.now(),
    name: data.name,
    email: data.email,
    password: hashedPassword,
    createdAt: new Date()
  };
  return await userStore.createUser(newUser);
}


async function login(data) {

  const user = await userStore.findUserByEmail(data.email);

  if (!user.success) {
    return {
      "success": false,
      "message": "Invalid email or password"
    };
  }

  const isMatch = await bcrypt.compare(data.password, user.data.password);

  if (!isMatch) {
    return {
      "success": false,
      "message": "Invalid email or password"
    };
  }

  const token = generateToken({ id: user.data.id });

  return {
    success: true,
    data: {
      id: user.data.id,
      name: user.data.name,
      email: user.data.email
    },
    token: token
  };
}


module.exports = { register, login };