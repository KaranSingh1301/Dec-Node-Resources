//ES5
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  console.log("request received");

  return res.send("This is your server");
});

app.listen(8000, () => {
  console.log("server is running on port 8000");
});
