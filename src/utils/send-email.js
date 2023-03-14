const nodemailer = require("nodemailer");

const { USER_EMAIL, USER_PASSWORD } = require("../config/serverConfig");
const { ServerSideError } = require("../utils/errors/index");
const sendMail = (recieverEmail, url, subject) => {
  try {
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
      subject: subject,
      text: "Node.js testing mail for asif",
      html: `click this <a href=${REDIRECT_URL} > link</a> to verify`,
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log("Error Occurs", err);
        throw new ServerSideError(
          "serverError",
          "problem in sending an email",
          "verification email not sent kindly try again"
        );
      } else {
        console.log("Email sent successfully", data);
      }
    });
  } catch (error) {
    throw new ServerSideError(
      "serverError",
      "something went wrong",
      `there was problem sending the verfication email kindly try again to signup`
    );
  }
};

module.exports = sendMail;
