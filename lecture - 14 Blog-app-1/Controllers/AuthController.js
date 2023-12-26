const express = require("express");
const { cleanUpAndValidate } = require("../Utils/AuthUtil");
const userSchema = require("../Schemas/userSchema");

const AuthRouter = express.Router();

AuthRouter.post("/register", async (req, res) => {
  console.log(req.body);
  const { username, email, password, name } = req.body;

  try {
    await cleanUpAndValidate({ email, username, password, name });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data issue",
      error: error,
    });
  }

  const userObj = new userSchema({
    name: name,
    email: email,
    password: password,
    username: username,
  });

  try {
    const userdb = await userObj.save();
    console.log(userdb);
    return res.send({
      status: 201,
      message: "User created successfully",
      data: userdb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

AuthRouter.post("/login", (req, res) => {
  console.log("login");
  return res.send("all ok");
});

module.exports = AuthRouter;
