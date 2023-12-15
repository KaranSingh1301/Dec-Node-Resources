const express = require("express");
require("dotenv").config();
const clc = require("cli-color");
const mongoose = require("mongoose");
const { cleanUpAndValidate } = require("./utils/authUtils");
const userModel = require("./models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const session = require("express-session");
const { isAuth } = require("./middlewares/isAuth");
const mongoDbsession = require("connect-mongodb-session")(session);

//contants
const app = express();
const PORT = process.env.PORT;
const store = new mongoDbsession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//mongodb connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(clc.yellowBright("MongoDb Connected"));
  })
  .catch((err) => {
    console.log(clc.redBright(err));
  });

//middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//routes
app.get("/", (req, res) => {
  return res.send("Server is running");
});

app.get("/register", (req, res) => {
  return res.render("register");
});

app.get("/login", (req, res) => {
  return res.render("login");
});

app.post("/register", async (req, res) => {
  const { name, email, password, username } = req.body;
  //data validation
  try {
    await cleanUpAndValidate({ name, email, password, username });
  } catch (error) {
    return res.send({
      status: 400,
      error: error,
    });
  }

  try {
    //unique feilds should not be in DB

    const userEmailExists = await userModel.findOne({ email });
    if (userEmailExists) {
      return res.send({
        status: 400,
        message: "Email already exists",
        data: email,
      });
    }

    const userUsernameExists = await userModel.findOne({ username });
    if (userUsernameExists) {
      return res.send({
        status: 400,
        message: "Username already exists",
        data: username,
      });
    }

    //hashing the password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT)
    );

    //create a user in DB
    const userObj = new userModel({
      //schema, bodyData
      name: name,
      email: email,
      username: username,
      password: hashedPassword,
    });

    const userDb = await userObj.save();

    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

app.post("/login", async (req, res) => {
  const { loginId, password } = req.body;

  //data validation
  if (!loginId || !password) {
    return res.send({
      status: 400,
      message: "Missing credentials",
    });
  }

  try {
    let userDb = {};
    //find user with loginId
    if (validator.isEmail(loginId)) {
      //email
      userDb = await userModel.findOne({ email: loginId });
    } else {
      //username
      userDb = await userModel.findOne({ username: loginId });
    }

    if (!userDb) {
      return res.send({
        status: 400,
        message: "Login id not found, please register first",
      });
    }

    //password compare
    const isMatch = await bcrypt.compare(password, userDb.password);
    if (!isMatch) {
      return res.send({
        status: 400,
        message: "Password incorrect",
      });
    }

    //Session base Auth
    req.session.isAuth = true;
    req.session.user = {
      userId: userDb._id,
      username: userDb.username,
      email: userDb.email,
    };

    return res.redirect("/dashboard");
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

app.get("/dashboard", isAuth, (req, res) => {
  return res.send("Dashboard Page");
});

app.listen(PORT, () => {
  console.log(clc.yellowBright("Server is running"));
  console.log(clc.yellowBright.underline(`http://localhost:${PORT}`));
});

//Basic Express layout
//MongoDb connection

//Register Page
//Registeration API

//Login Page
//login Api

//session base Auth

//Dashboard Page
//Logout
//logout from all devices

//TODO API
//create
//edit
//delete
//read

//Dashboard
//Axios GET and POST
//read component

//Pagination API
//Rate Limiting

//deployment

//M(models), V(view), C(controller)

//client(react, 3000) <-------> server(express, 8000)

// axios.get('/',{}).then((res)=>{
//   if(res.status!==201)
//   {
//     alert(res.message)
//   }
// }).catch((err)=>{})
