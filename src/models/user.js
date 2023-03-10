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
      this.belongsToMany(models.role, {
        through: "user_roles",
      });
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
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  });

  User.beforeUpdate(async (user) => {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  });
  return User;
};
