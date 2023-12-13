//ES5
const express = require("express");
const mongoose = require("mongoose");
const userModel = require("./userModel");
const session = require("express-session");
const isAuth = require("./authMiddleware");
const mongoDbSession = require("connect-mongodb-session")(session);

//conatants
const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI =
  "mongodb+srv://karan:12345@cluster0.22wn2.mongodb.net/DecemberTestDb";

const store = new mongoDbSession({
  uri: MONGO_URI,
  collection: "sessions",
});

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "This is nodejs class",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//mongodb connection

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Mongodb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

//api
app.get("/", (req, res) => {
  console.log("hello / GET");
  return res.send("This is your server");
});

app.get("/testing", (req, res) => {
  console.log("get request working");
  console.log(req.session);

  return res.send("Working");
});

//api HTML form

app.get("/api/html", (req, res) => {
  return res.send(
    `
        <html>
        <body>
        <h1>This is form<h1/>
        <form action = "/api/form_submit" method="POST">
        <label for="name">Name</label>
        <input type="text" name="name"></input>
        <br/>
        <label for="email">Email</label>
        <input type="text" name="email"></input>
        <br/>
        <label for="password">Password</label>
        <input type="text" name="password"></input>
        <br/>
        <button type='submit'>Submit</button>
        </form>
        <body/>
        <html/>
        `
  );
});

app.post("/api/form_submit", async (req, res) => {
  const nameC = req.body.name;
  const emailC = req.body.email;
  const passwordC = req.body.password;

  const userObj = new userModel({
    //schema : client
    name: nameC,
    email: emailC,
    password: passwordC,
  });

  try {
    const data = await userModel.findOne({ email: emailC });
    if (data) {
      return res.send({
        status: 400,
        message: "Email already exits",
      });
    }

    const userDb = await userObj.save();
    console.log(userDb);

    //store the session in DB
    req.session.isAuth = true;
    req.session.user = {
      name: userDb.name,
      email: userDb.email,
      userId: userDb._id,
    };

    return res.send({
      status: 201,
      message: "User creates successfully",
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

app.get("/dashboard", isAuth, (req, res) => {
  return res.send("Dashboard Page");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
