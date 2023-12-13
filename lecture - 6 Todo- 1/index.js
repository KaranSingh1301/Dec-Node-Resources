const express = require("express");
require("dotenv").config();
const clc = require("cli-color");
const mongoose = require("mongoose");
const { cleanUpAndValidate } = require("./utils/authUtils");
const userModel = require("./models/userModel");

//conatants
const app = express();
const PORT = process.env.PORT;

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
  //unique feilds should not be in DB
  //create a user in DB
  const userObj = new userModel({
    //schema, bodyData
    name: name,
    email: email,
    username: username,
    password: password,
  });

  try {
    const userDb = await userObj.save();

    return res.send({
      status: 201,
      message: "User created succssfully",
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

app.post("/login", (req, res) => {});

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
