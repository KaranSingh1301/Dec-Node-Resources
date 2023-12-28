const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    require: true,
    minLength: 2,
    maxLength: 50,
  },
  textBody: {
    type: String,
    require: true,
    minLength: 2,
    maxLength: 1000,
  },
  creationDateTime: {
    type: String,
    require: true,
  },
  userId: {
    type: Schema.Types.ObjectId, //fk to userSchema
    require: true,
    ref: "user",
  },
});

module.exports = mongoose.model("blog", blogSchema);
