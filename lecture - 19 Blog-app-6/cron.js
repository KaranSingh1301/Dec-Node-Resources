const cron = require("node-cron");
const blogSchema = require("./Schemas/blogSchema");

const cleanUpBin = () => {
  //run every day at 1am
  cron.schedule("* 1 * * *", async () => {
    // find the blogs in DB where isDeleted : true
    const deletedBlogs = await blogSchema.find({ isDeleted: true });

    if (deletedBlogs.length > 0) {
      deletedBlogs.map((blog) => {
        console.log(blog.title);

        const diff =
          new Date(Date.now() - blog.deletionDateTime).getTime() /
          (1000 * 60 * 60 * 24);

        if (diff > 30) {
          blogSchema
            .findOneAndDelete({ _id: blog._id })
            .then(() => {
              console.log(`blog has been deleted successfully : ${blog._id}`);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  });
};

module.exports = cleanUpBin;
