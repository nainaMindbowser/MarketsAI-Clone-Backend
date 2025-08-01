// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Common error response structure
class ErrorResponse {
  /**
   * Create validation error response
   * @param {Array} errors - Validation errors
   * @returns {Object} - Error response object
   */
  static validationError(errors) {
    return {
      success: false,
      message: errors[0].message,
      code: errors[0].code,
      field: errors[0].field,
      errors: errors,
    };
  }

  /**
   * Create authentication error response
   * @param {string} message - Error message
   * @param {string} code - Error code
   * @returns {Object} - Error response object
   */
  static authError(message, code) {
    return {
      success: false,
      message,
      code,
    };
  }

  /**
   * Create success response
   * @param {string} message - Success message
   * @param {Object} data - Response data
   * @param {Object} meta - Additional metadata
   * @returns {Object} - Success response object
   */
  static success(message, data = null, meta = {}) {
    const response = {
      success: true,
      message,
    };

    if (data !== null) {
      response.data = data;
    }

    // Add metadata if provided
    Object.keys(meta).forEach((key) => {
      response[key] = meta[key];
    });

    return response;
  }

  /**
   * Create error response with custom status
   * @param {string} message - Error message
   * @param {string} code - Error code
   * @param {Object} additionalFields - Additional fields
   * @returns {Object} - Error response object
   */
  static error(message, code, additionalFields = {}) {
    return {
      success: false,
      message,
      code,
      ...additionalFields,
    };
  }
}

module.exports = {
  HTTP_STATUS,
  ErrorResponse,
};
