const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accessSchema = new Schema({
  sessionId: {
    type: String,
    require: true,
  },
  time: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("access", accessSchema);
