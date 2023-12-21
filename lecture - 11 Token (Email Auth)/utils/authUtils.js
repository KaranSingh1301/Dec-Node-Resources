const validator = require("validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const cleanUpAndValidate = ({ email, password, name, username }) => {
  return new Promise((resolve, reject) => {
    if (!email || !name || !username || !password)
      reject("Missing Credentials");

    if (typeof email !== "string") reject("Datatype of email is incorrect");
    if (typeof name !== "string") reject("Datatype of name is incorrect");
    if (typeof username !== "string")
      reject("Datatype of username is incorrect");
    if (typeof password !== "string")
      reject("Datatype of password is incorrect");

    if (username.length <= 2 || username.length > 30)
      reject("Username should be of 3-30 chars");
    if (password.length <= 2 || password.length > 30)
      reject("Password should be of 3-30 chars");

    if (!validator.isEmail(email)) reject("Format of email is wrong");

    resolve();
  });
};

const generateJWTToken = (email) => {
  const token = jwt.sign(email, process.env.SECRET_KEY);
  return token;
};

const sendVerificationEmail = ({ email, verificationToken }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: "kssinghkaran13@gmail.com",
      pass: "wtkp eaay qqhr doxo",
    },
  });

  const mailOptions = {
    from: "kssinghkaran13@gmail.com",
    to: email,
    subject: "Email verification for TODO APP",
    html: `Click <a href='http://localhost:8000/verifytoken/${verificationToken}'> Here </a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    else console.log("Email has been sent successfully: " + info.response);
  });
};

module.exports = {
  cleanUpAndValidate,
  generateJWTToken,
  sendVerificationEmail,
};
