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
      message: `user created successfully kindly verify the email`,
      data: user,
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

const httpLoginUser = async (req, res) => {
  try {
    const userObj = {
      email: req.body.email,
      password: req.body.password,
    };
    console.log(userObj);
    const { user, token } = await userService.loginUser(userObj);
    res.cookie("x-access-token", "bearer " + token);
    res.set("x-access-token", "bearer " + token);
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
module.exports = {
  httpGetUser,
  httpRegisterUser,
  httpVerifyEmail,
  httpLoginUser,
};
