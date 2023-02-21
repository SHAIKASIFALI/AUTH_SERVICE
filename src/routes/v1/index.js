const express = require("express");
const userRoutes = require("./user");
const v1Router = express.Router();

v1Router.use("/user", userRoutes);

module.exports = v1Router;
