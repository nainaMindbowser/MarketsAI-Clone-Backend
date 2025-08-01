const SENDER_EMAIL_CONSTANTS = {
  ERRORS: {
    EMAIL_REQUIRED: "Email address is required",
    INVALID_EMAIL_FORMAT: "Invalid email format",
    INVALID_YOPMAIL: "Email must be a valid yopmail.com address",
    EMAIL_ALREADY_EXISTS: "Email address already exists",
    EMAIL_NOT_FOUND: "Sender email not found",
    DELETE_FAILED: "Failed to delete sender email",
    CREATE_FAILED: "Failed to create sender email",
    UPDATE_FAILED: "Failed to update sender email",
    FETCH_FAILED: "Failed to fetch sender emails",
  },
  SUCCESS: {
    EMAIL_CREATED: "Sender email created successfully",
    EMAIL_UPDATED: "Sender email updated successfully",
    EMAIL_DELETED: "Sender email deleted successfully",
    EMAILS_FETCHED: "Sender emails fetched successfully",
  },
  VALIDATION: {
    YOPMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]*yopmail\.com$/,
    EMAIL_MIN_LENGTH: 5,
    EMAIL_MAX_LENGTH: 100,
  },
};

const SENDER_EMAIL_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DELETED: "deleted",
};

module.exports = {
  SENDER_EMAIL_CONSTANTS,
  SENDER_EMAIL_STATUS,
};
