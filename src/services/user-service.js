const UserRepository = require("../repository/user-repository");
const jwt = require("jsonwebtoken");
const { EMAIL_SECRET, LOGIN_SECRET } = require("../config/serverConfig");
const sendEmail = require("../utils/send-email");
const bcrypt = require("bcrypt");
class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUser(data) {
    try {
      const user = await this.userRepository.getUser(data.id);
      return user;
    } catch (error) {
      console.log("something went wrong in the service layer");
      console.error(error);
    }
  }

  async registerUser(data) {
    try {
      const isUserExists = await this.userRepository.getUserByEmail(data.email);
      if (isUserExists) {
        throw new Error("email is already registered kindly login");
      }

      const user = await this.userRepository.registerUser({
        email: data.email,
        password: data.password,
      });
      if (user.isVerified == false) {
        const token = await this.createEmailVerficationToken(user);
        console.log(token);
        sendEmail(token, user.email);
      }
      return user;
    } catch (error) {
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
        throw new Error(
          "your email is not verified kindly verify your email  before logging in"
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
      throw error;
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
}

module.exports = UserService;
