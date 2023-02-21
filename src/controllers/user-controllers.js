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
    const user = await userService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: `user created successfully`,
      data: user,
      error: {},
    });
  } catch (error) {
    res.status(500).json({
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
};
