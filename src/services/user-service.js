const UserRepository = require("../repository/user-repository");

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
      const user = await this.userRepository.registerUser({
        email: data.email,
        password: data.password,
      });
      return user;
    } catch (error) {
      console.log("something went wrong in the service layer");
      console.error(error);
    }
  }
}

module.exports = UserService;
