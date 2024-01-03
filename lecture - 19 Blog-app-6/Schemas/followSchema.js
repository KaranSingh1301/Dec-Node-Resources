const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followSchema = new Schema({
  followerUserId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  followingUserId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  creationDateTime: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("follow", followSchema);
