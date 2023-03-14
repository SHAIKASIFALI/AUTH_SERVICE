const { User, role } = require("../models/index");
const {
  AttributeNotFoundError,
  ServerSideError,
} = require("../utils/errors/index");
const { StatusCodes } = require("http-status-codes");
class UserRepository {
  async getUser(id) {
    try {
      const user = await User.findByPk(id, {
        attributes: ["email", "id", "isVerified", "password"],
      });
      return user;
    } catch (error) {
      throw new ServerSideError(
        "serverError",
        "something went wrong in the repository layer",
        "there is an error while fethcing user from database"
      );
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await User.findOne({
        where: {
          email: email,
        },
      });
      console.log(user);
      return user;
    } catch (error) {
      throw new ServerSideError(
        "serverError",
        "something went wrong in the repository layer",
        "error occured in fetching user using email"
      );
    }
  }
  async registerUser({ email, password }) {
    try {
      const user = await User.create({
        email: email,
        password: password,
      });
      return user;
    } catch (error) {
      throw new ServerSideError(
        "serverError",
        "something went wrong in the repository layer",
        "error occured in creating an user in database"
      );
    }
  }

  async updateUserVerificationStatus(id) {
    try {
      const user = await User.findByPk(id);
      await User.update(
        { ...user, isVerified: true },
        {
          where: {
            id: id,
          },
        }
      );
      return true;
    } catch (error) {
      console.log(`something went wrong in repository layer`);
      console.log(error);
      throw ServerSideError(
        "serverError",
        "something went wrong in the repository layer",
        "error occured in updating an user verification status in database"
      );
    }
  }

  async updateUserPassword(id, data) {
    const password = data;
    try {
      const user = await User.findByPk(id);
      await User.update(
        {
          ...user,
          password: password,
        },
        {
          where: {
            id: id,
          },
          individualHooks: true,
        }
      );
      return true;
    } catch (error) {
      console.log(`something went wrong in repository layer`);
      console.log(error);
      throw ServerSideError(
        "serverError",
        "something went wrong in the repository layer",
        "error occured in updating an user password in database"
      );
    }
  }

  async isAdmin(userId) {
    try {
      const user = await User.findByPk(userId);
      const admin_role = await role.findOne({
        where: {
          name: "Admin",
        },
      });
      return await user.hasRole(admin_role);
    } catch (error) {
      console.log(`something went wrong in repository layer`);
      console.log(error);
      throw ServerSideError(
        "serverError",
        "something went wrong in the repository layer",
        "error occured in checking if an user is admin or not"
      );
    }
  }
  async addAdmin(userId) {
    try {
      const admin_role = await role.findOne({
        where: {
          name: "Admin",
        },
      });
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw ClientSideError(
          `clientError`,
          `something went wrong while finding user`,
          `user doesnot exist kindly signup`,
          StatusCodes.NOT_FOUND
        );
      }
      await admin_role.addUser(user);
      return this.isAdmin(userId);
    } catch (error) {
      throw new ServerSideError(
        `serverError`,
        `something went wrong in the repository layer`,
        `error occured during adding the admin role`
      );
    }
  }
  async getAllUsers() {
    try {
      const users = await User.findAll({
        attributes: ["email", "isVerified", "id"],
      });
      return users;
    } catch (error) {
      console.log(`something went wrong in repository layer`);
      console.log(error);
      throw ServerSideError(
        "serverError",
        "something went wrong in the repository layer",
        "error occured in checking if an user is admin or not"
      );
    }
  }
}

module.exports = UserRepository;
