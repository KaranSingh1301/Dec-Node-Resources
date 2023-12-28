const blogSchema = require("../Schemas/blogSchema");
const { LIMIT } = require("../privateConstants");
const ObjectId = require("mongodb").ObjectId;

let Blog = class {
  title;
  textBody;
  userId;
  creationDateTime;

  constructor({ title, textBody, userId, creationDateTime }) {
    this.title = title;
    this.textBody = textBody;
    this.userId = userId;
    this.creationDateTime = creationDateTime;
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
};

module.exports = Blog;
