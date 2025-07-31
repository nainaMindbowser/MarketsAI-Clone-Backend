const EMAIL_HISTORY_MESSAGES = {
  HISTORY_RETRIEVED: "Email history retrieved successfully",
  ALL_HISTORY_RETRIEVED: "All email history retrieved successfully",
  STATS_RETRIEVED: "Email history stats retrieved successfully",
  EVENT_UPDATED: "Email event updated successfully",
  RECORD_CREATED: "Email history record created successfully",
  RECORD_UPDATED: "Email history record updated successfully",
};

const EMAIL_HISTORY_ERRORS = {
  HISTORY_FETCH_ERROR: "HISTORY_FETCH_ERROR",
  STATS_FETCH_ERROR: "STATS_FETCH_ERROR",
  EVENT_UPDATE_ERROR: "EVENT_UPDATE_ERROR",
  RECORD_NOT_FOUND: "RECORD_NOT_FOUND",
  MISSING_REQUIRED_FIELDS: "MISSING_REQUIRED_FIELDS",
  INVALID_EVENT_TYPE: "INVALID_EVENT_TYPE",
  INVALID_DELIVERY_STATUS: "INVALID_DELIVERY_STATUS",
};

const EMAIL_EVENT_TYPES = {
  SENT: "sent",
  DELIVERED: "delivered",
  OPENED: "opened",
  CLICKED: "clicked",
  BOUNCED: "bounced",
  FAILED: "failed",
};

const DELIVERY_STATUSES = {
  PENDING: "pending",
  SENT: "sent",
  DELIVERED: "delivered",
  FAILED: "failed",
  BOUNCED: "bounced",
};

const EMAIL_HISTORY_FILTERS = {
  RECIPIENT: "recipient",
  SUBJECT: "subject",
  EVENT_TYPE: "eventType",
  DELIVERY_STATUS: "deliveryStatus",
  EMAIL_TYPE: "emailType",
  SUBSCRIPTION_TYPE: "subscriptionType",
  DATE_FROM: "dateFrom",
  DATE_TO: "dateTo",
};

module.exports = {
  EMAIL_HISTORY_MESSAGES,
  EMAIL_HISTORY_ERRORS,
  EMAIL_EVENT_TYPES,
  DELIVERY_STATUSES,
  EMAIL_HISTORY_FILTERS,
};
