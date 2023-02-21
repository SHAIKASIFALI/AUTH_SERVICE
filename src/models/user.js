"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
const { SALT_ROUNDS } = require("../config/serverConfig");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 100],
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.beforeCreate(async (user) => {
    await bcrypt.hash(user.password, SALT_ROUNDS, function (err, hash) {
      if (err) {
        console.log(err);
      } else user.password = hash;
    });
  });
  return User;
};