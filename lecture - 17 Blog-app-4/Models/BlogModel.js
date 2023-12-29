const blogSchema = require("../Schemas/blogSchema");
const { LIMIT } = require("../privateConstants");
const ObjectId = require("mongodb").ObjectId;

let Blog = class {
  title;
  textBody;
  userId;
  creationDateTime;
  blogId;

  constructor({ title, textBody, userId, creationDateTime, blogId }) {
    this.title = title;
    this.textBody = textBody;
    this.userId = userId;
    this.creationDateTime = creationDateTime;
    this.blogId = blogId;
  }

  createBlog() {
    return new Promise(async (resolve, reject) => {
      //Schema<----model

      this.title.trim();
      this.textBody.trim();

      const blog = new blogSchema({
        title: this.title,
        textBody: this.textBody,
        creationDateTime: this.creationDateTime,
        userId: this.userId,
      });

      try {
        const blogDb = await blog.save();
        resolve(blogDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  // t0----------------->t1
  // --------------------------->t2
  // ? : ;
  static getBlogs({ SKIP }) {
    return new Promise(async (resolve, reject) => {
      //pagination, sort
      try {
        const blogDb = await blogSchema.aggregate([
          {
            $sort: { creationDateTime: -1 }, //DESC order of time
          },
          {
            $facet: {
              data: [{ $skip: SKIP }, { $limit: LIMIT }],
            },
          },
        ]);
        resolve(blogDb[0].data);
      } catch (error) {
        reject(error);
      }
    });
  }

  static myBlogs({ SKIP, userId }) {
    return new Promise(async (resolve, reject) => {
      //pag, sort, match

      try {
        const myblogDb = await blogSchema.aggregate([
          {
            $match: { userId: new ObjectId(userId) },
          },
          {
            $sort: { creationDateTime: -1 },
          },
          {
            $facet: {
              data: [{ $skip: SKIP }, { $limit: LIMIT }],
            },
          },
        ]);

        resolve(myblogDb[0].data);
      } catch (error) {
        reject(error);
      }
    });
  }
  //Blog.myBlogs({SKIP, userId})

  static getBlogWithId({ blogId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const blogDb = await blogSchema.findOne({ _id: blogId });

        if (!blogDb) reject("Blog not found");

        resolve(blogDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  // obj = new Blog( title, textBody, userId, creationDateTime, blogId)
  // obj.updateBlog
  updateBlog() {
    return new Promise(async (resolve, reject) => {
      let newBlogData = {};

      if (this.title) {
        newBlogData.title = this.title;
      }

      if (this.textBody) {
        newBlogData.textBody = this.textBody;
      }

      try {
        const oldBlogDb = await blogSchema.findOneAndUpdate(
          { _id: this.blogId },
          newBlogData
        );

        resolve(oldBlogDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static deleteBlog({ blogId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const deletedBlog = await blogSchema.findOneAndDelete({ _id: blogId });
        resolve(deletedBlog);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = Blog;
