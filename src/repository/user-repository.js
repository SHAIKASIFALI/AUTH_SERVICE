const { User } = require("../models/index");

class UserRepository {
  async getUser(id) {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      console.log(`something went wrong in repository layer`);
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
    }
  }
}

module.exports = UserRepository;
