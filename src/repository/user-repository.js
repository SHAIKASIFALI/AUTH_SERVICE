const { User } = require("../models/index");

class UserRepository {
  async getUser(id) {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      console.log(`something went wrong in repository layer`);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await User.findOne({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error) {
      console.log(`something went wrong in repository layer`);
      console.log(error);
      throw error;
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
      throw error;
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
      throw error;
    }
  }
}

module.exports = UserRepository;
