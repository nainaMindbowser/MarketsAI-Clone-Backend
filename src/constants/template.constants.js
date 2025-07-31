const TEMPLATE_CONSTANTS = {
  ERRORS: {
    NAME_REQUIRED: "Template name is required",
    SUBJECT_REQUIRED: "Subject is required",
    CONTENT_REQUIRED: "Template content is required",
    INVALID_NAME_LENGTH: "Template name must be between 2 and 100 characters",
    INVALID_SUBJECT_LENGTH: "Subject must be between 2 and 200 characters",
    INVALID_CONTENT_LENGTH:
      "Template content must be between 10 and 50000 characters",
    TEMPLATE_ALREADY_EXISTS: "Template with this name already exists",
    TEMPLATE_NOT_FOUND: "Template not found",
    INVALID_ID: "Invalid template ID",
  },
  SUCCESS: {
    TEMPLATE_CREATED: "Template created successfully",
    TEMPLATE_UPDATED: "Template updated successfully",
    TEMPLATE_DELETED: "Template deleted successfully",
    TEMPLATES_FETCHED: "Templates fetched successfully",
    TEMPLATE_FETCHED: "Template fetched successfully",
  },
  VALIDATION: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    SUBJECT_MIN_LENGTH: 2,
    SUBJECT_MAX_LENGTH: 200,
    CONTENT_MIN_LENGTH: 10,
    CONTENT_MAX_LENGTH: 50000,
    NAME_REGEX: /^[a-zA-Z0-9\s_-]+$/,
  },
};

const TEMPLATE_ERROR_CODES = {
  VALIDATION_ERROR: "TEMPLATE_VALIDATION_ERROR",
  DUPLICATE_NAME: "TEMPLATE_DUPLICATE_NAME",
  NOT_FOUND: "TEMPLATE_NOT_FOUND",
};

module.exports = {
  TEMPLATE_CONSTANTS,
  TEMPLATE_ERROR_CODES,
};
