const { User, role } = require("../models/index");
const {
  AttributeNotFoundError,
  ServerSideError,
} = require("../utils/errors/index");
const { StatusCodes } = require("http-status-codes");
class UserRepository {
  async getUser(id) {
    try {
      const user = await User.findByPk(id);
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

      // if (!user) {
      //   throw new AttributeNotFoundError(
      //     "email",
      //     "email not found",
      //     "email is not registered in database kindly register",
      //     StatusCodes.NOT_FOUND
      //   );
      // }
      return user;
    } catch (error) {
      console.log(`something went wrong in repository layer`);
      console.log(error);
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
      console.log(`something went wrong in repository layer`);
      console.log(error);
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
      console.log(user, admin_role);
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
}

module.exports = UserRepository;
