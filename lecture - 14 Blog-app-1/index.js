const express = require("express");
const clc = require("cli-color");
require("dotenv").config();
const AuthRouter = require("./Controllers/AuthController");

//file-imports
const db = require("./db");

//constants
const app = express();
const PORT = process.env.PORT || 8000;

//middlewares
app.use(express.json());

app.get("/", (req, res) => {
  return res.send({
    status: 200,
    message: "Server is running",
  });
});

//Routes

app.use("/auth", AuthRouter);

app.listen(PORT, () => {
  console.log(clc.yellowBright.underline(`server is running on PORT:${PORT}`));
});
