const express = require("express");
const bcrypt = require("bcrypt");
const { cleanUpAndValidate } = require("../Utils/AuthUtil");
const User = require("../Models/UserModel");
const isAuth = require("../Middlewares/AuthMiddleware");
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

  try {
    //check if email and username exist
    await User.findUsernameAndEmailExist({ email, username });

    const userObj = new User({ email, username, password, name });
    const userDb = await userObj.registerUser();
    console.log(userDb);
    return res.send({
      status: 201,
      message: "User created successfully",
      data: userDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

AuthRouter.post("/login", async (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.send({
      status: 400,
      message: "Missing credentials",
    });
  }

  try {
    const userDb = await User.findUserEmailOrUsername({ loginId });
    console.log(userDb);

    const isMatch = await bcrypt.compare(password, userDb.password);
    if (!isMatch) {
      return res.send({
        status: 400,
        message: "Password does not match",
      });
    }

    //session base auth
    console.log(req.session);
    req.session.isAuth = true;
    req.session.user = {
      userId: userDb._id,
      email: userDb.email,
      username: userDb.username,
    };

    return res.send({
      status: 200,
      message: "Login Successfull",
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

AuthRouter.post("/logout", isAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send({
        status: 500,
        message: "Logout unsuccessfull",
        error: err,
      });
    }

    return res.send({
      status: 200,
      message: "Logout successfull",
    });
  });
});

module.exports = AuthRouter;

//Index.js<--->Controller(User)<---->Model(UserSchema)<---->Schema(mongoose.Schema)<--->Mongoose
