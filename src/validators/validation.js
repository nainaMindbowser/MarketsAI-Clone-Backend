const {
  SUBSCRIPTION_TYPES,
  DEVICE_TYPES,
} = require("../constants/customers.constants");
const { MESSAGES, REGEX } = require("../constants/validation.constants");

//  validation utility functions for customers

class ValidationUtils {
  static validateFilterParams(query) {
    const errors = [];

    if (query.subscriptionType) {
      const normalizedSubscriptionType = query.subscriptionType
        .toLowerCase()
        .replace("-", "-");
      const validSubscriptionTypes = Object.values(SUBSCRIPTION_TYPES);
      if (!validSubscriptionTypes.includes(normalizedSubscriptionType)) {
        errors.push(MESSAGES.INVALID_SUBSCRIPTION_TYPE);
      }
    }

    if (query.deviceType) {
      const normalizedDeviceType = query.deviceType.toUpperCase();
      const validDeviceTypes = Object.values(DEVICE_TYPES);
      if (!validDeviceTypes.includes(normalizedDeviceType)) {
        errors.push(MESSAGES.INVALID_DEVICE_TYPE);
      }
    }

    if (query.startDate && isNaN(Date.parse(query.startDate))) {
      errors.push(MESSAGES.INVALID_START_DATE);
    }

    if (query.endDate && isNaN(Date.parse(query.endDate))) {
      errors.push(MESSAGES.INVALID_END_DATE);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static normalizeSubscriptionType(subscriptionType) {
    if (!subscriptionType) return subscriptionType;
    return subscriptionType
      .toLowerCase()
      .replace(REGEX.WHITESPACE_TO_DASH, "-");
  }

  static normalizeDeviceType(deviceType) {
    if (!deviceType) return deviceType;
    return deviceType.toUpperCase();
  }

  static sanitizeString(input) {
    if (typeof input !== "string") return input;
    return input.trim().replace(REGEX.HTML_TAGS, "");
  }
}

module.exports = {
  ValidationUtils,
};
