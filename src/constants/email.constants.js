const EMAIL_MESSAGES = {
  SEND_SUCCESS: "Email sent successfully",
  SEND_FAILED: "Failed to send email",
  TEMPLATE_NOT_FOUND: "Template not found",
  NO_RECIPIENTS: "No recipients found",
  INVALID_EMAIL_TYPE: "Invalid email type",
  INVALID_SUBSCRIPTION_TYPE: "Invalid subscription type",
  MISSING_TEMPLATE_ID: "Template ID is required",
  MISSING_EMAILS: "Email addresses are required",
};

const EMAIL_ERROR_CODES = {
  TEMPLATE_NOT_FOUND: "TEMPLATE_NOT_FOUND",
  INVALID_EMAIL_TYPE: "INVALID_EMAIL_TYPE",
  INVALID_SUBSCRIPTION_TYPE: "INVALID_SUBSCRIPTION_TYPE",
  MISSING_TEMPLATE_ID: "MISSING_TEMPLATE_ID",
  MISSING_EMAILS: "MISSING_EMAILS",
  SEND_FAILED: "EMAIL_SEND_FAILED",
  SMTP_ERROR: "SMTP_ERROR",
};

const EMAIL_TYPES = {
  CUSTOMER_TYPE: "customer-type",
  INDIVIDUAL: "individual",
};

const SUBSCRIPTION_TYPES = {
  BOTH: "both",
  BASIC: "basic",
  PROFESSIONAL: "professional",
};

module.exports = {
  EMAIL_MESSAGES,
  EMAIL_ERROR_CODES,
  EMAIL_TYPES,
  SUBSCRIPTION_TYPES,
};
