const nodemailer = require("nodemailer");
const { USER_EMAIL, USER_PASSWORD } = require("../config/serverConfig");
const { ServerSideError } = require("../utils/errors/index");
const sendMail = (recieverEmail, url) => {
  const REDIRECT_URL = url;
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: USER_EMAIL,
      pass: USER_PASSWORD,
    },
  });

  let mailDetails = {
    from: USER_EMAIL,
    to: recieverEmail,
    subject: "Test mail",
    text: "Node.js testing mail for asif",
    html: `click this <a href=${REDIRECT_URL} > link</a> to verify`,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs");
      throw new ServerSideError(
        "serverError",
        "problem in sending an email",
        "verification email not sent kindly try again"
      );
    } else {
      console.log("Email sent successfully", data);
    }
  });
};

module.exports = sendMail;
