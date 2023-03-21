const UserRepository = require("../repository/user-repository");
const { ClientSideError, ServerSideError } = require("../utils/errors/index");
const jwt = require("jsonwebtoken");
const { EMAIL_SECRET, LOGIN_SECRET, PORT } = require("../config/serverConfig");
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
      if (!user) {
        throw new ClientSideError(
          `clientError`,
          `resource not found`,
          `user not found with given id`,
          StatusCodes.NOT_FOUND
        );
      }
      return user;
    } catch (error) {
      if (error.name === "serverError" || error.name === "clientError")
        throw error;
      else
        throw new ServerSideError(
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
        const url = `http://localhost:${PORT}/api/v1/users/auth/signup/verifyemail/?token=${token}`;
        sendEmail(user.email, url, `Email Verification Mail`);
      }
      return user.id;
    } catch (error) {
      if (error.name === "clientError" || error.name === "serverError")
        throw error;
      else
        throw new ServerSideError(
          "serverError",
          "something went wrong in the service layer",
          "somethin went wrong in the service layer",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
  }
  async loginUser(data) {
    try {
      const user = await this.userRepository.getUserByEmail(data.email);
      if (!user) {
        throw new ClientSideError(
          `clientError`,
          `something error while login`,
          `email id is not registered kindly sign up before logging in`,
          StatusCodes.BAD_REQUEST
        );
      }
      if (!user.isVerified) {
        const token = await this.createEmailVerficationToken(user);
        console.log(token);
        const url = `http://localhost:${PORT}/api/v1/users/auth/signup/verifyemail/?token=${token}`;
        sendEmail(user.email, url, `Email verification mail`);
        throw new ClientSideError(
          `clientError`,
          `something went wrong while logging in `,
          `please verify your email before logging in`,
          StatusCodes.BAD_REQUEST
        );
      }
      const response = await this.validatePassword(
        user.password,
        data.password
      );
      if (!response) {
        throw new ClientSideError(
          `clientError`,
          `something wnet wrong while logging in `,
          `please enter the correct email or password`,
          StatusCodes.BAD_REQUEST
        );
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
      if (error.name === `serverError` || error.name === `clientError`)
        throw error;
      else
        throw new ServerSideError(
          `serverError`,
          `something went wrong in the service layer`,
          `something wnet wrong while logging in`
        );
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
        throw new ClientSideError(
          `clientError`,
          `something went wrong while verifying the token`,
          `invalid verification token or user`,
          StatusCodes.BAD_REQUEST
        );
      }
      return decoded.id;
    } catch (error) {
      if (error.name === `serverError` || error.name === `clientError`)
        throw error;
      else
        throw new ServerSideError(
          `serverError`,
          `something wrong occured`,
          `error occured while verifying the token`,
          StatusCodes.ServerSideError
        );
    }
  }
  async validatePassword(hashedPassword, enteredPassword) {
    try {
      const response = await bcrypt.compare(enteredPassword, hashedPassword);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(data) {
    try {
      console.log(data);
      const user = await this.userRepository.getUserByEmail(data.email);
      console.log(user);
      if (!user) {
        throw new ClientSideError(
          `clientError`,
          `email doesnt exist`,
          `the above email is not an registered user kindly create an account`,
          StatusCodes.BAD_REQUEST
        );
      }
      const token = await this.createForgotPasswordToken(user);
      const url = `http://localhost:${PORT}/api/v1/users/auth/forgotpassword/${user.id}/?token=${token}`;
      await sendEmail(user.email, url, `Password reset link`);
      return user;
    } catch (error) {
      console.log("something went wrong in the service layer", error);
      if (error.name === `serverError` || error.name === `clientError`)
        throw error;
      else
        throw new ServerSideError(
          `serverError`,
          `something wrong in service layer `,
          `something went wrong during forgot password`
        );
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
      throw new ServerSideError(
        "serverError",
        "something went wrong in the service layer",
        "error occured in creating an verification token for email"
      );
    }
  }
  async verifyEmailVerificationToken(token) {
    try {
      var decoded = jwt.verify(token, EMAIL_SECRET);
      const user = await this.userRepository.getUser(decoded.id);
      console.log(user);
      if (!user) {
        throw new Error("invalid token");
      }
      this.userRepository.updateUserVerificationStatus(decoded.id);
      return decoded.id;
    } catch (error) {
      console.log(
        "something error occurred while verifiying a verification link"
      );
      throw new ServerSideError(
        "serverError",
        "something went wrong while verifiying link",
        "verification link may have expired"
      );
    }
  }

  async createForgotPasswordToken(data) {
    try {
      const sign = EMAIL_SECRET + data.password;
      console.log(sign);
      return await jwt.sign(
        {
          id: data.id,
          time: Date.now(),
        },
        sign,
        { expiresIn: "24h" }
      );
    } catch (error) {
      throw new ServerSideError(
        `serverError`,
        `something went wrong while creating password verification link`,
        `check the payload and the signature`,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async verifyForgotPasswordToken(data) {
    try {
      const { id, token, password } = data;
      const user = await this.userRepository.getUser(id);
      console.log(id, token, password, user);
      const sign = EMAIL_SECRET + user.password;
      console.log(sign);
      var decoded = await jwt.verify(token, sign);
      await this.userRepository.updateUserPassword(id, password);
      return {
        userId: id,
      };
    } catch (error) {
      if (error.name === `clientError` || error.name === `serverError`)
        throw error;
      else
        throw new ServerSideError(
          `serverError`,
          `something went wrong at the service layer`,
          `password verfication may be expired or invalid password link or already u may have used once this link to change the password`
        );
    }
  }
  // async verifyPasswordVerificationToken(token, data) {
  //   try {
  //     const sign = EMAIL_SECRET + data.password;
  //     var decoded = jwt.verify(token, sign);
  //     const user = this.userRepository.getUser(decoded.id);
  //     if (!user) {
  //       throw new Error("invalid token");
  //     }
  //   } catch (error) {
  //     console.log(
  //       "something error occurred while verifiying a verification link"
  //     );
  //     throw error;
  //   }
  // }

  async isAuthenticated(accessToken) {
    try {
      const user_id = this.verifyLoginToken(accessToken);
      return user_id;
    } catch (error) {
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
  async addAdmin(userId) {
    try {
      const response = await this.userRepository.addAdmin(userId);
      return response;
    } catch (error) {
      if (error.name === `clientError` || error.name === `serverError`)
        throw error;
      else
        throw new ServerSideError(
          `serverError`,
          `something wnet wrong at the service layer`,
          `error occured while adding user as admin`,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
  }
  async getAllUsers() {
    try {
      const users = await this.userRepository.getAllUsers();
      return users;
    } catch (error) {
      throw new ServerSideError(
        "serverError",
        "something went wrong during fetching all users ",
        "something went wrong during fetching all users "
      );
    }
  }
}

module.exports = UserService;
