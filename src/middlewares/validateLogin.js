const { LOGIN_MESSAGES } = require("../constants/validation.constants");

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  const definedEmail = process.env.ADMIN_LOGIN_EMAIL;
  const definedPassword = process.env.ADMIN_LOGIN_PASSWORD;

  if (!definedEmail || !definedPassword) {
    return res.status(500).json({
      success: false,
      message: LOGIN_MESSAGES.SERVER_ERROR,
    });
  }

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: LOGIN_MESSAGES.MISSING_FIELDS,
    });
  }

  if (email !== definedEmail || password !== definedPassword) {
    return res.status(401).json({
      success: false,
      message: LOGIN_MESSAGES.INVALID_CREDENTIALS,
    });
  }

  next();
};

module.exports = validateLogin;
