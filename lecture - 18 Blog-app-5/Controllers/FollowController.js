const express = require("express");
const User = require("../Models/UserModel");
const FollowRouter = express.Router();
const {
  followUser,
  followerUserList,
  followingUserList,
} = require("../Models/FollowModel");

FollowRouter.post("/follow-user", async (req, res) => {
  const followingUserId = req.body.followingUserId;
  const followerUserId = req.session.user.userId;

  try {
    await User.verifyUserId({ userId: followingUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid following user Id",
      error: error,
    });
  }

  try {
    await User.verifyUserId({ userId: followerUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid follower user Id",
      error: error,
    });
  }

  try {
    const followDb = await followUser({ followingUserId, followerUserId });

    return res.send({
      status: 201,
      message: "Follow Successfull",
      data: followDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

//followers-list?skip=10
FollowRouter.get("/followers-list", async (req, res) => {
  const followingUserId = req.session.user.userId;
  const SKIP = parseInt(req.query.skip) || 0;

  try {
    const followerList = await followerUserList({ followingUserId, SKIP });

    return res.send({
      status: 200,
      message: "Read success",
      data: followerList,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

FollowRouter.get("/following-list", async (req, res) => {
  const followerUserId = req.session.user.userId;
  const SKIP = parseInt(req.query.skip) || 0;

  try {
    const followingList = await followingUserList({ followerUserId, SKIP });

    return res.send({
      status: 200,
      message: "Read success",
      data: followingList,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

module.exports = FollowRouter;
