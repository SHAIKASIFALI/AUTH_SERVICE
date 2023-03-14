const UserService = require("../services/user-service");
const userService = new UserService();
const { StatusCodes } = require("http-status-codes");
const { ServerSideError } = require("../utils/errors");

const httpGetUser = async (req, res) => {
  try {
    const user = await userService.getUser(req.params);
    res.status(StatusCodes.OK).json({
      success: true,
      data: user,
      msg: `user deatils fetched successfully`,
      err: {},
    });
  } catch (error) {
    res.status(error.statusCode).json({
      success: false,
      message: `something went wrong`,
      data: {},
      err: error,
    });
  }
};

const httpRegisterUser = async (req, res) => {
  try {
    const userObj = {
      email: req.body.email,
      password: req.body.password,
    };
    const user = await userService.registerUser(userObj);
    res.status(StatusCodes.OK).json({
      success: true,
      message: `user created successfully kindly click the link sent to your registerd email to verify the email`,
      data: user,
      error: {},
    });
  } catch (error) {
    res.status(error.statusCode).json({
      success: false,
      message: `something went wrong`,
      data: {},
      err: error,
    });
  }
};

const httpLoginUser = async (req, res) => {
  try {
    const userObj = {
      email: req.body.email,
      password: req.body.password,
    };
    const { user, token } = await userService.loginUser(userObj);
    const user_obj = {
      email: user.email,
    };
    // res.cookie("x-access-token", token);
    res.set("x-access-token", token);
    res.status(StatusCodes.OK).json({
      data: user_obj,
      msg: "user logged in successfully",
      success: true,
      err: {},
    });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode).json({
      success: false,
      message: `something went wrong`,
      data: {},
      err: error,
    });
  }
};
const httpIsAuthenticated = async (req, res) => {
  try {
    const id = await userService.isAuthenticated(req.headers["x-access-token"]);
    res.status(StatusCodes.OK).json({
      data: id,
      msg: `user is authenticated`,
      success: true,
      err: {},
    });
  } catch (error) {
    res.status(error.statusCode).json({
      success: false,
      message: `something went wrong`,
      data: {},
      err: error,
    });
  }
};
const httpVerifyEmail = async (req, res) => {
  try {
    const id = await userService.verifyEmailVerificationToken(req.query.token);
    res.status(201).json({
      success: true,
      message: `email verified successfully`,
      data: id,
      error: {},
    });
  } catch (error) {
    res.status(error.statusCode).json({
      success: false,
      message: `something went wrong`,
      data: {},
      err: error,
    });
  }
};

const httpLogoutUser = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    res.set("x-access-token", null);
    const user_id = await userService.verifyLoginToken(token);
    res.status(StatusCodes.ACCEPTED).json({
      success: true,
      msg: `logout done successfully`,
      data: user_id,
      err: {},
    });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode).json({
      success: false,
      message: `something went wrong`,
      data: {},
      err: error,
    });
  }
};

const httpForgotPassword = async (req, res) => {
  try {
    if (!req.query.token) {
      const user = await userService.forgotPassword(req.body);
      return res.status(StatusCodes.OK).json({
        data: user.email,
        msg: `link has been sent to the registered email id`,
        success: true,
        err: {},
      });
    } else {
      const data = {
        id: req.params.id,
        token: req.query.token,
        password: req.body.password,
      };
      const user = await userService.verifyForgotPasswordToken(data);
      return res.status(StatusCodes.OK).json({
        data: user,
        msg: `password has changed succesfully`,
        success: true,
        err: {},
      });
    }
  } catch (error) {
    console.log(error);
    res.status(error.statusCode).json({
      success: false,
      message: `something went wrong`,
      data: {},
      err: error,
    });
  }
};

const httpIsAdmin = async (req, res) => {
  try {
    const response = await userService.isAdmin(req.params.id);
    return res.status(200).json({
      success: true,
      data: response,
      msg: `verified admin or not successfully`,
      err: {},
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `something went wrong`,
      data: {},
      err: error.message,
    });
  }
};

const httpAddAdmin = async (req, res) => {
  try {
    console.log(req.body);
    const response = await userService.addAdmin(req.body.id);
    console.log(response);
    if (!response) {
      throw new ServerSideError(
        `serverError`,
        `something went wrong while admin role allocation`,
        `admin role allocation error`,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      data: `user with ${req.body.id} id has promoted as an admin`,
      msg: `allocation of the admin role done succesfully`,
      err: {},
    });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode).json({
      success: false,
      message: `something went wrong`,
      data: {},
      err: error,
    });
  }
};
const httpGetAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(StatusCodes.OK).json({
      data: users,
      message: `successfully fetched all users`,
      success: true,
      err: {},
    });
  } catch (error) {
    res.status(error.statusCode).json({
      success: false,
      message: `something went wrong`,
      data: {},
      err: error,
    });
  }
};
module.exports = {
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
};
