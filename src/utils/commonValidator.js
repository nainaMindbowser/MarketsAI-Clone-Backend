const {
  VALIDATION_RULES,
  VALIDATION_MESSAGES,
  VALIDATION_ERROR_CODES,
} = require("../constants/validation.constants");

class CommonValidator {
  static validateEmail(email, fieldName = "email") {
    if (!email || !email.trim()) {
      return {
        field: fieldName,
        message: VALIDATION_MESSAGES.EMAIL_REQUIRED,
        code: VALIDATION_ERROR_CODES.REQUIRED_FIELD,
      };
    }

    if (!VALIDATION_RULES.EMAIL.REGEX.test(email.trim())) {
      return {
        field: fieldName,
        message: VALIDATION_MESSAGES.EMAIL_INVALID,
        code: VALIDATION_ERROR_CODES.INVALID_FORMAT,
      };
    }

    return null;
  }

  static validatePassword(password, fieldName = "password") {
    if (!password || !password.trim()) {
      return {
        field: fieldName,
        message: VALIDATION_MESSAGES.PASSWORD_REQUIRED,
        code: VALIDATION_ERROR_CODES.REQUIRED_FIELD,
      };
    }

    if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
      return {
        field: fieldName,
        message: VALIDATION_MESSAGES.PASSWORD_TOO_SHORT,
        code: VALIDATION_ERROR_CODES.INVALID_LENGTH,
      };
    }

    return null;
  }

  static validateFirstName(firstName, fieldName = "firstName") {
    if (!firstName || !firstName.trim()) {
      return {
        field: fieldName,
        message: VALIDATION_MESSAGES.FIRST_NAME_REQUIRED,
        code: VALIDATION_ERROR_CODES.REQUIRED_FIELD,
      };
    }

    const trimmedFirstName = firstName.trim();

    if (trimmedFirstName.length < VALIDATION_RULES.FIRST_NAME.MIN_LENGTH) {
      return {
        field: fieldName,
        message: VALIDATION_MESSAGES.FIRST_NAME_TOO_SHORT,
        code: VALIDATION_ERROR_CODES.INVALID_LENGTH,
      };
    }

    if (trimmedFirstName.length > VALIDATION_RULES.FIRST_NAME.MAX_LENGTH) {
      return {
        field: fieldName,
        message: VALIDATION_MESSAGES.FIRST_NAME_TOO_LONG,
        code: VALIDATION_ERROR_CODES.INVALID_LENGTH,
      };
    }

    return null;
  }

  static validateLastName(lastName, fieldName = "lastName") {
    if (!lastName || !lastName.trim()) {
      return {
        field: fieldName,
        message: VALIDATION_MESSAGES.LAST_NAME_REQUIRED,
        code: VALIDATION_ERROR_CODES.REQUIRED_FIELD,
      };
    }

    const trimmedLastName = lastName.trim();

    if (trimmedLastName.length < VALIDATION_RULES.LAST_NAME.MIN_LENGTH) {
      return {
        field: fieldName,
        message: VALIDATION_MESSAGES.LAST_NAME_TOO_SHORT,
        code: VALIDATION_ERROR_CODES.INVALID_LENGTH,
      };
    }

    if (trimmedLastName.length > VALIDATION_RULES.LAST_NAME.MAX_LENGTH) {
      return {
        field: fieldName,
        message: VALIDATION_MESSAGES.LAST_NAME_TOO_LONG,
        code: VALIDATION_ERROR_CODES.INVALID_LENGTH,
      };
    }

    return null;
  }

  static validateRole(role, fieldName = "role") {
    if (role && !VALIDATION_RULES.ROLES.includes(role)) {
      return {
        field: fieldName,
        message: VALIDATION_MESSAGES.ROLE_INVALID,
        code: VALIDATION_ERROR_CODES.INVALID_VALUE,
      };
    }

    return null;
  }

  static validateRequired(value, fieldName, message) {
    if (!value || (typeof value === "string" && !value.trim())) {
      return {
        field: fieldName,
        message: message || `${fieldName} is required`,
        code: VALIDATION_ERROR_CODES.REQUIRED_FIELD,
      };
    }

    return null;
  }

  static collectErrors(validators) {
    const errors = [];

    validators.forEach((validator) => {
      const error = validator();
      if (error) {
        errors.push(error);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

module.exports = CommonValidator;
