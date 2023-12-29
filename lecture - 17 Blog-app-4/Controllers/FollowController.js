const express = require("express");
const FollowRouter = express.Router();

FollowRouter.get("/check", (req, res) => {
  return res.send("all ok");
});

module.exports = FollowRouter;
