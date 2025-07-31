const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  LOGIN_ERROR: "Login error:",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  NO_TOKEN: "Access denied. No token provided.",
  INVALID_TOKEN: "Invalid token",
  TOKEN_EXPIRED: "Token expired",
  TOKEN_VERIFICATION_FAILED: "Token verification failed",
};

const AUTH_ERRORS = {
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  INVALID_EMAIL_FORMAT: "Please provide a valid email address",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters long",
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_NOT_FOUND: "No account found with this email address",
  INCORRECT_PASSWORD: "Incorrect password",
  ACCOUNT_DISABLED: "Your account has been disabled",
  SERVER_ERROR: "Internal server error. Please try again later",
  DATABASE_ERROR: "Database connection error",
  USER_ALREADY_EXISTS: "An account with this email already exists",
  INVALID_ROLE: "Invalid role specified",
  ACCESS_DENIED: "Access denied. Admin privileges required",
  TOKEN_GENERATION_FAILED: "Failed to generate authentication token",
};

const AUTH_ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_FAILED: "AUTHENTICATION_FAILED",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  ACCOUNT_DISABLED: "ACCOUNT_DISABLED",
  SERVER_ERROR: "SERVER_ERROR",
  ACCESS_DENIED: "ACCESS_DENIED",
  USER_EXISTS: "USER_EXISTS",
};

module.exports = {
  AUTH_MESSAGES,
  AUTH_ERRORS,
  AUTH_ERROR_CODES,
};
