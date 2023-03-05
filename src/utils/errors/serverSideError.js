const { StatusCodes } = require("http-status-codes");

class ServerSideError extends Error {
  constructor(
    name = `server side error`,
    msg = `something went wrong`,
    explanation = `something went wrong`,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super();
    this.name = name;
    this.msg = msg;
    this.explanation = explanation;
    this.statusCode = statusCode;
  }
}

module.exports = ServerSideError;
