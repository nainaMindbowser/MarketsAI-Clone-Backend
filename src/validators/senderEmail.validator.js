const {
  SENDER_EMAIL_CONSTANTS,
} = require("../constants/senderEmail.constants");

class SenderEmailValidator {
  /**
   * Validate email format and yopmail domain
   * @param {string} email - Email to validate
   * @returns {Object} - Validation result
   */
  static validateEmail(email) {
    const errors = [];

    // Check if email is provided
    if (!email) {
      errors.push(SENDER_EMAIL_CONSTANTS.ERRORS.EMAIL_REQUIRED);
      return { isValid: false, errors };
    }

    // Check if email is string and trim it
    const trimmedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!trimmedEmail) {
      errors.push(SENDER_EMAIL_CONSTANTS.ERRORS.EMAIL_REQUIRED);
      return { isValid: false, errors };
    }

    // Check email length
    if (
      trimmedEmail.length < SENDER_EMAIL_CONSTANTS.VALIDATION.EMAIL_MIN_LENGTH
    ) {
      errors.push(SENDER_EMAIL_CONSTANTS.ERRORS.INVALID_EMAIL_FORMAT);
    }

    if (
      trimmedEmail.length > SENDER_EMAIL_CONSTANTS.VALIDATION.EMAIL_MAX_LENGTH
    ) {
      errors.push(SENDER_EMAIL_CONSTANTS.ERRORS.INVALID_EMAIL_FORMAT);
    }

    // Strict yopmail validation
    if (!SENDER_EMAIL_CONSTANTS.VALIDATION.YOPMAIL_REGEX.test(trimmedEmail)) {
      errors.push(SENDER_EMAIL_CONSTANTS.ERRORS.INVALID_YOPMAIL);
    }

    return {
      isValid: errors.length === 0,
      errors,
      email: trimmedEmail,
    };
  }

  /**
   * Validate sender email creation data
   * @param {Object} data - Data to validate
   * @returns {Object} - Validation result
   */
  static validateCreateData(data) {
    const errors = [];

    if (!data || typeof data !== "object") {
      errors.push("Invalid data provided");
      return { isValid: false, errors };
    }

    // Validate email
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.push(...emailValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors,
      validatedData: {
        email: emailValidation.email,
      },
    };
  }

  /**
   * Validate MongoDB ObjectId
   * @param {string} id - ID to validate
   * @returns {Object} - Validation result
   */
  static validateId(id) {
    const mongoose = require("mongoose");

    if (!id) {
      return {
        isValid: false,
        error: "ID is required",
      };
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        isValid: false,
        error: "Invalid ID format",
      };
    }

    return {
      isValid: true,
      id: id.trim(),
    };
  }

  /**
   * Sanitize string input
   * @param {string} input - Input to sanitize
   * @returns {string} - Sanitized input
   */
  static sanitizeString(input) {
    if (typeof input !== "string") return input;
    return input.trim().replace(/[<>]/g, "");
  }
}

module.exports = SenderEmailValidator;
