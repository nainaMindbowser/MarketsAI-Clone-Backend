const {
  SUBSCRIPTION_TYPES,
  DEVICE_TYPES,
} = require("../constants/customers.constants");
const {
  MESSAGES,
  REGEX,
  VALIDATION_ERROR_CODES,
} = require("../constants/validation.constants");
const CommonValidator = require("../utils/commonValidator");

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
        errors.push({
          field: "subscriptionType",
          message: MESSAGES.INVALID_SUBSCRIPTION_TYPE,
          code: VALIDATION_ERROR_CODES.INVALID_VALUE,
        });
      }
    }

    if (query.deviceType) {
      const normalizedDeviceType = query.deviceType.toUpperCase();
      const validDeviceTypes = Object.values(DEVICE_TYPES);
      if (!validDeviceTypes.includes(normalizedDeviceType)) {
        errors.push({
          field: "deviceType",
          message: MESSAGES.INVALID_DEVICE_TYPE,
          code: VALIDATION_ERROR_CODES.INVALID_VALUE,
        });
      }
    }

    if (query.startDate && isNaN(Date.parse(query.startDate))) {
      errors.push({
        field: "startDate",
        message: MESSAGES.INVALID_START_DATE,
        code: VALIDATION_ERROR_CODES.INVALID_FORMAT,
      });
    }

    if (query.endDate && isNaN(Date.parse(query.endDate))) {
      errors.push({
        field: "endDate",
        message: MESSAGES.INVALID_END_DATE,
        code: VALIDATION_ERROR_CODES.INVALID_FORMAT,
      });
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
