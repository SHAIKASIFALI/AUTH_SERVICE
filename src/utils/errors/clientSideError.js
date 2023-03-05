const { StatusCodes } = require("http-status-codes");

class ClientSideError extends Error {
  constructor(
    name = `client side error`,
    msg = `something went wrong`,
    explanation = `something went wrong`,
    statusCode = StatusCodes.NOT_FOUND
  ) {
    super();
    this.name = name;
    this.msg = msg;
    this.explanation = explanation;
    this.statusCode = statusCode;
  }
}

module.exports = ClientSideError;
