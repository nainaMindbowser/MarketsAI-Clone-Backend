const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const { AUTH_MESSAGES } = require("../constants/auth.constants");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = generateToken({ email });

    return res.status(200).json({
      success: true,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      token,
      user: { email },
    });
  } catch (error) {
    console.error(AUTH_MESSAGES.LOGIN_ERROR, error);
    return res.status(500).json({
      success: false,
      message: AUTH_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = { login };
