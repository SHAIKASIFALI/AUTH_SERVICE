const express = require("express");
const {
  httpGetUser,
  httpRegisterUser,
} = require("../../controllers/user-controllers");
const userRouter = express.Router();

userRouter.get("/:id", httpGetUser);
userRouter.post("/", httpRegisterUser);

module.exports = userRouter;
