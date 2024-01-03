const BlogDataValidator = ({ title, textBody }) => {
  return new Promise((resolve, reject) => {
    if (!title || !textBody) {
      reject("Missing credentials");
    }

    if (typeof title !== "string") reject("Title is not a text");
    if (typeof textBody !== "string") reject("Blog Body is not a text");

    resolve();
  });
};

module.exports = { BlogDataValidator };
