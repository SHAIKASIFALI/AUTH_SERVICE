const UserService = require("../services/user-service");
const userService = new UserService();

const httpGetUser = async (req, res) => {
  try {
    const user = await userService.getUser(req.params);
    res.status(200).json({
      success: true,
      data: user ? user : `user not found`,
      msg: `user deatils fetched successfully`,
      err: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `something went wrong`,
      data: {},
      err: error,
    });
    console.log(error);
  }
};

const httpRegisterUser = async (req, res) => {
  try {
    const userObj = {
      email: req.body.email,
      password: req.body.password,
    };
    const user = await userService.registerUser(userObj);
    res.status(201).json({
      success: true,
      message: `user created successfully kindly click the link sent to your registerd email to verify the email`,
      data: user,
      error: {},
    });
  } catch (error) {
    res.status(error.statusCode).json({
      success: false,
      message: error.msg,
      data: error.name,
      err: error.explanation,
    });
  }
};

const httpLoginUser = async (req, res) => {
  try {
    const userObj = {
      email: req.body.email,
      password: req.body.password,
    };
    console.log(userObj);
    const { user, token } = await userService.loginUser(userObj);
    res.cookie("x-access-token", token);
    res.set("x-access-token", token);
    console.log();
    res.status(200).json({
      data: { ...user, "x-access-token": token },
      msg: "user logged in successfully",
      success: true,
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
const httpIsAuthenticated = async (req, res) => {
  try {
    const id = await userService.isAuthenticated(req.headers["x-access-token"]);
    res.status(200).json({
      data: id,
      msg: `user is authenticated`,
      success: true,
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
    console.log(error);
    res.status(500).json({
      success: false,
      message: `something went wrong`,
      data: {},
      err: error.message,
    });
  }
};

const httpLogoutUser = async (req, res) => {
  try {
    res.set("x-access-token", null);
    res.status(200).json({
      success: true,
      msg: `logout done successfully`,
      data: {},
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

const httpForgotPassword = async (req, res) => {
  try {
    if (!req.query.token) {
      const user = await userService.forgotPassword(req.body);
      return res.status(200).json({
        data: user,
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
      await userService.verifyForgotPasswordToken(data);
      return res.status(200).json({
        data: {},
        msg: `password has changed succesfully`,
        success: true,
        err: {},
      });
    }
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

module.exports = {
  httpGetUser,
  httpRegisterUser,
  httpVerifyEmail,
  httpLoginUser,
  httpIsAuthenticated,
  httpLogoutUser,
  httpForgotPassword,
  httpIsAdmin,
};
