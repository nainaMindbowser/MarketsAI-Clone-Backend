module.exports = {
  MESSAGES: {
    INVALID_SUBSCRIPTION_TYPE: "Invalid subscription type filter",
    INVALID_DEVICE_TYPE: "Invalid device type filter",
    INVALID_START_DATE: "Invalid start date format",
    INVALID_END_DATE: "Invalid end date format",
  },
  REGEX: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    WHITESPACE_TO_DASH: /\s+/g,
    HTML_TAGS: /[<>]/g,
  },
  LOGIN_MESSAGES: {
    SERVER_ERROR: "Server configuration error. Contact administrator.",
    MISSING_FIELDS: "Email and password are required",
    INVALID_CREDENTIALS: "Invalid credentials",
  },
};
