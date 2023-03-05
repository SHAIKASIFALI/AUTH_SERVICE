const RegistrationParamValidator = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      data: {},
      msg: `email or password is missing kindly check`,
      success: false,
      err: {},
    });
  }

  next();
};

const emailFormatValidator = (req, res, next) => {
  const EMAIL_REGEXP_VALIDATOR =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/;
  const emailRegexp = new RegExp(EMAIL_REGEXP_VALIDATOR);
  if (!emailRegexp.test(req.body.email)) {
    return res.status(400).json({
      data: {},
      msg: `invalid email format kindly enter a valid email format`,
      success: false,
      err: {},
    });
  }
  next();
};

const passwordFormatValidator = (req, res, next) => {
  const PASSWORD_REGEXP_VALIDATOR =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const passwordRegexp = new RegExp(PASSWORD_REGEXP_VALIDATOR);
  if (!passwordRegexp.test(req.body.password)) {
    return res.status(400).json({
      data: {},
      msg: `invalid password format makesure that password contains\n 
            1.Atleast one uppercase english letter[A-Z]\n
            2.Atleast one lowercase english letter[a-z]\n
            3.Atleast one digit [0-9]\n
            4.Atleast one special character[!,#,$,&,*,_,-]\n
            5.Password should have atleast 8 characters `,
      success: false,
      err: {},
    });
  }
  next();
};

const accessTokenValidator = async (req, res, next) => {
  if (!req.headers["x-access-token"]) {
    res.status(400).json({
      data: {},
      msg: `x-access-token is not set for validating user`,
      success: false,
      err: {},
    });
  }
  next();
};

const adminRequestValidator = async (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      data: {},
      msg: `something went wrong`,
      err: `id parameter is missing`,
    });
  }
  next();
};
module.exports = {
  RegistrationParamValidator,
  emailFormatValidator,
  passwordFormatValidator,
  accessTokenValidator,
  adminRequestValidator,
};
