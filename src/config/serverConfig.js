const dotenv = require("dotenv");
dotenv.config();
console.log(process.env.PORT);
module.exports = {
  PORT: process.env.PORT,
  SALT_ROUNDS: 10,
  DB_SYNC: process.env.DB_SYNC,
  EMAIL_SECRET: process.env.VERIFY_SECRET,
  LOGIN_SECRET: process.env.LOGIN_SECRET,
  USER_EMAIL: process.env.USER_EMAIL,
  USER_PASSWORD: process.env.USER_PASSWORD,
};
