const express = require("express");
const {
  httpGetUser,
  httpRegisterUser,
  httpVerifyEmail,
  httpLoginUser,
} = require("../../controllers/user-controllers");
const userRouter = express.Router();
const { AuthRegisterMiddlewares } = require("../../middlewares/index");
userRouter.get("/signup/verifyemail", httpVerifyEmail);
userRouter.get("/:id", httpGetUser);
userRouter.post(
  "/signup",
  AuthRegisterMiddlewares.RegistrationParamValidator,
  AuthRegisterMiddlewares.emailFormatValidator,
  AuthRegisterMiddlewares.passwordFormatValidator,
  httpRegisterUser
);
userRouter.post(
  "/login",
  AuthRegisterMiddlewares.RegistrationParamValidator,
  AuthRegisterMiddlewares.emailFormatValidator,
  httpLoginUser
);
module.exports = userRouter;
