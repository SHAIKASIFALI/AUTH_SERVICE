const express = require("express");
const userRouter = express.Router();

const {
  httpGetUser,
  httpRegisterUser,
  httpVerifyEmail,
  httpLoginUser,
  httpIsAuthenticated,
  httpLogoutUser,
  httpForgotPassword,
  httpIsAdmin,
  httpGetAllUsers,
  httpAddAdmin,
} = require("../../controllers/user-controllers");
const { AuthRegisterMiddlewares } = require("../../middlewares/index");

userRouter.get("/auth/signup/verifyemail", httpVerifyEmail);
userRouter.post(
  "/auth/signup",
  AuthRegisterMiddlewares.RegistrationParamValidator,
  AuthRegisterMiddlewares.emailFormatValidator,
  AuthRegisterMiddlewares.passwordFormatValidator,
  httpRegisterUser
);
userRouter.post(
  "/auth/login",
  AuthRegisterMiddlewares.RegistrationParamValidator,
  AuthRegisterMiddlewares.emailFormatValidator,
  httpLoginUser
);
userRouter.get("/auth/isAuthenticated", httpIsAuthenticated); //
userRouter.get(
  "/auth/logout",
  AuthRegisterMiddlewares.accessTokenValidator,
  httpLogoutUser
);
userRouter.post("/auth/forgotpassword", httpForgotPassword);
userRouter.post("/auth/forgotpassword/:id", httpForgotPassword);
userRouter.get(
  "/auth/isAdmin/:id",
  AuthRegisterMiddlewares.adminRequestValidator,
  httpIsAdmin
);
userRouter.post("/auth/addAdmin", httpAddAdmin);
userRouter.get("/:id", httpGetUser);
userRouter.get("/", httpGetAllUsers);
module.exports = userRouter;
