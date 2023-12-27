const userSchema = require("../Schemas/userSchema");
const bcrypt = require("bcrypt");

let User = class {
  username;
  name;
  password;
  email;

  constructor({ email, password, name, username }) {
    this.email = email;
    this.name = name;
    this.username = username;
    this.password = password;
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      const hashedPassword = await bcrypt.hash(
        this.password,
        parseInt(process.env.SALT)
      );
      const userObj = new userSchema({
        name: this.name,
        email: this.email,
        password: hashedPassword,
        username: this.username,
      });

      try {
        const userDb = await userObj.save();

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static findUsernameAndEmailExist({ email, username }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userExist = await userSchema.findOne({
          $or: [{ email }, { username }],
        });

        if (userExist && userExist.email === email)
          reject("Email Already in use.");

        if (userExist && userExist.username === username)
          reject("Username Already in use.");

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  static findUserEmailOrUsername({ loginId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDb = await userSchema.findOne({
          $or: [{ email: loginId }, { username: loginId }],
        });

        if (!userDb) reject("User does not exits, please register first");

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = User;
