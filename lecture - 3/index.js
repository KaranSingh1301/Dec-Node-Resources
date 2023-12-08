//ES5
const { urlencoded } = require("body-parser");
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("hello / GET");
  return res.send("This is your server");
});

app.post("/create-user", (req, res) => {
  console.log("post request working");
  console.log(req.body);

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

app.post("/api/form_submit", (req, res) => {
  console.log(req.body);
  return res.send("Form submitted successfully");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
