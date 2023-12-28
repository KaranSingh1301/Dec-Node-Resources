const express = require("express");
const BlogRouter = express.Router();
const Blog = require("../Models/BlogModel");
const { BlogDataValidator } = require("../Utils/BlogUtils");
const User = require("../Models/UserModel");

BlogRouter.post("/create-blog", async (req, res) => {
  console.log(req.body);

  const { title, textBody } = req.body;
  const userId = req.session.user.userId;
  const creationDateTime = Date.now();

  try {
    await BlogDataValidator({ title, textBody });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data invalidate",
      error: error,
    });
  }

  try {
    const userDb = await User.verifyUserId({ userId });
  } catch (error) {
    return res.send({
      status: 400,
      error: error,
    });
  }
  //model(constructor)<-----obj(Controller)
  try {
    const blogObj = new Blog({ title, textBody, userId, creationDateTime });
    const blogDb = await blogObj.createBlog();

    return res.send({
      status: 201,
      message: "Blog Created Successfully",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

// /get-blogs?skip=5
BlogRouter.get("/get-blogs", async (req, res) => {
  const SKIP = parseInt(req.query.skip) || 0;

  try {
    const blogDb = await Blog.getBlogs({ SKIP });

    return res.send({
      status: 200,
      message: "Read Success",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

// /my-blogs?skip=2
BlogRouter.get("/my-blogs", async (req, res) => {
  const SKIP = parseInt(req.query.skip) || 0;
  const userId = req.session.user.userId;

  try {
    const myblogDb = await Blog.myBlogs({ SKIP, userId });

    return res.send({
      status: 200,
      message: "Read success",
      data: myblogDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

module.exports = BlogRouter;
