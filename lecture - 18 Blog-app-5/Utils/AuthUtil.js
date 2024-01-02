const validator = require("validator");

const cleanUpAndValidate = ({ name, username, email, password }) => {
  return new Promise((resolve, reject) => {
    if (!email || !name || !username || !password)
      reject("Missing Credentials");

    if (typeof username !== "string") reject("Username is not a string");

    if (typeof password !== "string") reject("Password is not a string");

    if (typeof name !== "string") reject("Name is not a string");

    if (username.length <= 2 || username.length > 50)
      reject("Username length should be 3-50 char");

    if (!validator.isEmail(email)) reject("Invalid Email format");

    resolve();
  });
};

module.exports = { cleanUpAndValidate };
