const { StatusCodes } = require("http-status-codes");

class AttributeNotFound extends Error {
  constructor(
    attribute,
    msg = `pls enter the valid attribute`,
    explanation = `attribute not register`,
    statusCode = StatusCodes.NOT_FOUND
  ) {
    super();
    this.name = `${attribute} not found`;
    this.msg = msg;
    this.explanation = explanation;
    this.statusCode = statusCode;
  }
}

module.exports = AttributeNotFound;
