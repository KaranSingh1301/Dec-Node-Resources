const isAuth = (req, res, next) => {
  console.log(req.session.user);
  if (req.session.isAuth) {
    next();
  } else {
    return res.send("Session expired from middleware");
  }
};

module.exports = isAuth;
