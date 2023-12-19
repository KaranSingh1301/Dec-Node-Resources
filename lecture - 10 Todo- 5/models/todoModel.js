const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  todo: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("todo", todoSchema);
