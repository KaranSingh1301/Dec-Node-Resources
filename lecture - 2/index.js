//ES5
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  console.log("request received");
  return res.send("This is your server");
});

app.get("/profiledata", (req, res) => {
  console.log("GET `/profiledata`");
  console.log(req);
  return res.send("Profile data received");
});

//query
//   /api?key=val
app.get("/api", (req, res) => {
  console.log(req.query);
  return res.send("Query api working");
});

//params

app.get("/joke/:id", (req, res) => {
  console.log(req.params);
  return res.send(`Param : ${req.params.id}`);
});

app.get("/api/:id/joke", (req, res) => {
  console.log(req.params);
  return res.send(`Param : ${req.params.id}`);
});

app.get("/api/:id1/:id2", (req, res) => {
  console.log(req.params);
  return res.send(`Param : ${req.params.id1}, ${req.params.id2}`);
});

app.listen(8000, () => {
  console.log("server is running on port 8000");
});
