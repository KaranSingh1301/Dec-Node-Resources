const accessModel = require("../models/accessModel");

const rateLimiting = async (req, res, next) => {
  console.log(req.session.id);
  const sessionId = req.session.id;

  //check if the person is making the request for the first time

  try {
    const accessDb = await accessModel.findOne({ sessionId: sessionId });

    //if !accessDb, then person is making the request for the first time
    if (!accessDb) {
      //create an entry in AccessModel
      const accessObj = new accessModel({
        sessionId: sessionId,
        time: Date.now(),
      });

      await accessObj.save();
      console.log(accessObj);
      next();
      return;
    }
    //===============>t1
    //======================>t2
    //then compare the time
    console.log((Date.now() - accessDb.time) / 1000);

    const diff = (Date.now() - accessDb.time) / 1000;
    if (diff < 3) {
      return res.send({
        status: 400,
        message: "Too many request, please wait for some time",
      });
    }

    //update the time in DB
    await accessModel.findOneAndUpdate({ sessionId }, { time: Date.now() });

    //allow the user to hit the API
    next();
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
};

module.exports = rateLimiting;
