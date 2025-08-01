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
  VALIDATION_RULES: {
    EMAIL: {
      REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      REQUIRED: true,
    },
    PASSWORD: {
      MIN_LENGTH: 6,
      REQUIRED: true,
    },
    FIRST_NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 30,
      REQUIRED: true,
    },
    LAST_NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 30,
      REQUIRED: true,
    },
    ROLES: ["admin", "user"],
  },
  VALIDATION_MESSAGES: {
    EMAIL_REQUIRED: "Email is required",
    EMAIL_INVALID: "Please provide a valid email address",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_TOO_SHORT: "Password must be at least 6 characters long",
    FIRST_NAME_REQUIRED: "First name is required",
    FIRST_NAME_TOO_SHORT: "First name must be at least 2 characters long",
    FIRST_NAME_TOO_LONG: "First name cannot exceed 30 characters",
    LAST_NAME_REQUIRED: "Last name is required",
    LAST_NAME_TOO_SHORT: "Last name must be at least 2 characters long",
    LAST_NAME_TOO_LONG: "Last name cannot exceed 30 characters",
    ROLE_INVALID: "Invalid role specified",
  },
  VALIDATION_ERROR_CODES: {
    REQUIRED_FIELD: "REQUIRED_FIELD",
    INVALID_FORMAT: "INVALID_FORMAT",
    INVALID_LENGTH: "INVALID_LENGTH",
    INVALID_VALUE: "INVALID_VALUE",
  },
};
