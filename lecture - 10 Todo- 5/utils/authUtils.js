const validator = require("validator");

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

module.exports = { cleanUpAndValidate };
