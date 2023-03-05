const UserRepository = require("../repository/user-repository");
const { ClientSideError, ServerSideError } = require("../utils/errors/index");
const jwt = require("jsonwebtoken");
const { EMAIL_SECRET, LOGIN_SECRET } = require("../config/serverConfig");
const sendEmail = require("../utils/send-email");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUser(data) {
    try {
      const user = await this.userRepository.getUser(data.id);
      return user;
    } catch (error) {
      if (error.name === "serverError") throw error;
      throw ServerSideError(
        "serverError",
        "something went wrong in the service layer",
        "error occured in creating an user in database"
      );
    }
  }

  async registerUser(data) {
    try {
      const isUserExists = await this.userRepository.getUserByEmail(data.email);
      if (isUserExists) {
        throw new ClientSideError(
          "clientError",
          "email already exists",
          "email is already registered kindly login",
          StatusCodes.BAD_REQUEST
        );
      }

      const user = await this.userRepository.registerUser({
        email: data.email,
        password: data.password,
      });
      if (user.isVerified == false) {
        const token = await this.createEmailVerficationToken(user);
        const url = `http://localhost:3000/api/v1/user/signup/verifyemail/?token=${token}`;
        sendEmail(user.email, url);
      }
      return user;
    } catch (error) {
      if (error.name === "clientError" || error.name === "serverError")
        throw error;
      console.log("something went wrong in the service layer", error);
      throw error;
    }
  }
  async loginUser(data) {
    try {
      const user = await this.userRepository.getUserByEmail(data.email);
      if (!user) {
        throw new Error("no such user exists kindly create an account");
      }
      if (!user.isVerified) {
        const token = await this.createEmailVerficationToken(user);
        console.log(token);
        const url = `http://localhost:3000/api/v1/user/signup/verifyemail/?token=${token}`;
        sendEmail(user.email, url);
        throw new Error(
          "your email is not verified kindly verify your email  before logging in.we have sent you an email for registration"
        );
      }
      const response = await this.validatePassword(
        user.password,
        data.password
      );
      if (!response) {
        throw new Error("email or password is incorrect try again");
      }
      const token = await this.createLoginToken({
        id: user.id,
        email: user.email,
      });
      return {
        user: user,
        token: token,
      };
    } catch (error) {
      console.log("something went wrong in the service layer", error);
      throw error;
    }
  }

  async createLoginToken(data) {
    try {
      return await jwt.sign(
        {
          id: data.id,
          email: data.email,
        },
        LOGIN_SECRET,
        { expiresIn: "24h" }
      );
    } catch (error) {
      console.log("something error occurred while creating a login jwt");
      throw error;
    }
  }

  async verifyLoginToken(token) {
    try {
      var decoded = jwt.verify(token, LOGIN_SECRET);
      const user = this.userRepository.getUser(decoded.id);
      if (!user) {
        throw new Error("invalid user");
      }
      return decoded.id;
    } catch (error) {
      console.log(
        "something error occurred while verifiying a verification link"
      );
      throw error;
    }
  }
  async validatePassword(hashedPassword, enteredPassword) {
    try {
      const response = await bcrypt.compare(enteredPassword, hashedPassword);
      return response;
    } catch (error) {
      console.log("something went wrong in the service layer", error);
      throw error;
    }
  }

  async forgotPassword(data) {
    try {
      const user = await this.userRepository.getUserByEmail(data.email);
      if (!user) {
        throw new Error("no such user exists kindly create an account");
      }
      const token = await this.createForgotPasswordToken(user);
      const url = `http://localhost:3000/api/v1/user/forgotpassword/${user.id}/?token=${token}`;
      sendEmail(user.email, url);
      return user;
    } catch (error) {
      console.log("something went wrong in the service layer", error);
      throw error;
    }
  }
  async createEmailVerficationToken(data) {
    try {
      return await jwt.sign(
        {
          id: data.id,
          time: Date.now(),
        },
        EMAIL_SECRET,
        { expiresIn: "1h" }
      );
    } catch (error) {
      console.log(
        "something error occurred while creating a verification link"
      );
      throw ServerSideError(
        "serverError",
        "something went wrong in the service layer",
        "error occured in creating an verification token for email"
      );
    }
  }
  async verifyEmailVerificationToken(token) {
    try {
      var decoded = jwt.verify(token, EMAIL_SECRET);
      const user = this.userRepository.getUser(decoded.id);
      if (!user) {
        throw new Error("invalid token");
      }
      this.userRepository.updateUserVerificationStatus(decoded.id);
      return decoded.id;
    } catch (error) {
      console.log(
        "something error occurred while verifiying a verification link"
      );
      throw error;
    }
  }

  async createForgotPasswordToken(data) {
    try {
      const sign = EMAIL_SECRET + data.password;
      return await jwt.sign(
        {
          id: data.id,
          time: Date.now(),
        },
        sign,
        { expiresIn: "24h" }
      );
    } catch (error) {
      console.log(
        "something error occurred while creating a verification link"
      );
      throw error;
    }
  }

  async verifyForgotPasswordToken(data) {
    try {
      const { id, token, password } = data;
      console.log(data);
      const user = await this.userRepository.getUser(id);
      console.log(user);
      const sign = EMAIL_SECRET + user.password;
      console.log(sign);
      var decoded = jwt.verify(token, sign);
      await this.userRepository.updateUserPassword(id, password);
    } catch (error) {
      console.log(
        "something error occurred while verifiying a verification link"
      );
      throw error;
    }
  }
  async verifyPasswordVerificationToken(token, data) {
    try {
      const sign = EMAIL_SECRET + data.password;
      var decoded = jwt.verify(token, sign);
      const user = this.userRepository.getUser(decoded.id);
      if (!user) {
        throw new Error("invalid token");
      }
    } catch (error) {
      console.log(
        "something error occurred while verifiying a verification link"
      );
      throw error;
    }
  }

  async isAuthenticated(accessToken) {
    try {
      const user_id = this.verifyLoginToken(accessToken);
      return user_id;
    } catch (error) {
      console.log(
        "something error occurred while verifiying a user is authenticated or not"
      );
      throw error;
    }
  }

  async isAdmin(userId) {
    try {
      const response = await this.userRepository.isAdmin(userId);
      return response;
    } catch (error) {
      console.log(
        "something error occurred while verifiying a user is admin or not"
      );
      throw error;
    }
  }
}

module.exports = UserService;
