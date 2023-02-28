const nodemailer = require("nodemailer");

console.log("heloooo...");

const sendMail = (token, recieverEmail) => {
  const REDIRECT_URL = `http://localhost:3000/api/v1/user/signup/verifyemail/?token=${token}`;
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "itsmeshaikasifali@gmail.com",
      pass: "cidskdvbhkfbjcgj",
    },
  });

  let mailDetails = {
    from: "itsmeshaikasifali@gmail.com",
    to: recieverEmail,
    subject: "Test mail",
    text: "Node.js testing mail for asif",
    html: `click this <a href=${REDIRECT_URL} > link</a> to verify`,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs");
      throw err;
    } else {
      console.log("Email sent successfully", data);
    }
  });
};

module.exports = sendMail;
