const jwt = require("jsonwebtoken");
const { AUTH_MESSAGES } = require("../constants/auth.constants");

// Authentication middleware to verify JWT tokens

const authenticate = (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: AUTH_MESSAGES.NO_TOKEN,
      });
    }

    // Verify token - using the same secret as token generation
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Add user info to request object
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: AUTH_MESSAGES.INVALID_TOKEN,
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: AUTH_MESSAGES.TOKEN_EXPIRED,
      });
    }

    return res.status(401).json({
      success: false,
      message: AUTH_MESSAGES.TOKEN_VERIFICATION_FAILED,
    });
  }
};

module.exports = {
  authenticate,
};
