const followSchema = require("../Schemas/followSchema");
const userSchema = require("../Schemas/userSchema");
const { LIMIT } = require("../privateConstants");
const ObjectId = require("mongodb").ObjectId;

const followUser = async ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check if the follow entry is there ot not

      const followExist = await followSchema.findOne({
        followerUserId,
        followingUserId,
      });

      if (followExist) {
        return reject("Already following the user");
      }

      //create an entry in DB

      const followObj = new followSchema({
        followerUserId,
        followingUserId,
        creationDateTime: Date.now(),
      });

      const followDb = await followObj.save();
      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};

const followerUserList = async ({ followingUserId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    //match, sort, pagination
    // const db = await followSchema.find({ followingUserId });

    const followerDb = await followSchema.aggregate([
      {
        $match: { followingUserId: new ObjectId(followingUserId) },
      },
      {
        $sort: { creationDateTime: -1 }, // DESC
      },
      {
        $facet: {
          data: [{ $skip: SKIP }, { $limit: LIMIT }],
        },
      },
    ]);

    // const followerDb = await followSchema
    //   .find({ followingUserId })
    //   .populate("followerUserId")
    //   .sort({ creationDateTime: -1 })

    console.log(followerDb[0].data);

    let followerUserIds = [];
    followerDb[0].data.map((obj) => {
      followerUserIds.push(obj.followerUserId);
    });

    console.log(followerUserIds);

    // followerUserIds.map(async(id)=>{
    //     const userDetails = await userSchema.findOne({_id : id})
    // })

    const followerUserDetails = await userSchema.aggregate([
      {
        $match: { _id: { $in: followerUserIds } },
      },
    ]);

    console.log(followerUserDetails);
    resolve(followerUserDetails.reverse());
  });
};

const followingUserList = async ({ followerUserId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    const followingDb = await followSchema.aggregate([
      {
        $match: { followerUserId: new ObjectId(followerUserId) },
      },
      {
        $sort: { creationDateTime: -1 }, // DESC
      },
      {
        $facet: {
          data: [{ $skip: SKIP }, { $limit: LIMIT }],
        },
      },
    ]);

    // const followerDb = await followSchema
    //   .find({ followingUserId })
    //   .populate("followerUserId")
    //   .sort({ creationDateTime: -1 })

    console.log(followingDb[0].data);

    let followingUserIds = [];
    followingDb[0].data.map((obj) => {
      followingUserIds.push(obj.followingUserId);
    });

    console.log(followingUserIds);

    // followerUserIds.map(async(id)=>{
    //     const userDetails = await userSchema.findOne({_id : id})
    // })

    const followerUserDetails = await userSchema.aggregate([
      {
        $match: { _id: { $in: followingUserIds } },
      },
    ]);

    console.log(followerUserDetails);
    resolve(followerUserDetails.reverse());
  });
};

const unfollowUser = async ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followDb = await followSchema.findOneAndDelete({
        followerUserId,
        followingUserId,
      });

      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  followUser,
  followerUserList,
  followingUserList,
  unfollowUser,
};

//

//test--->test1
//test---->test2
//test--->test3

//test1->test2
//test3->test2

//{test, test1}, {followerUSerId: test, followingUserID: test2}, {test1, test2}
