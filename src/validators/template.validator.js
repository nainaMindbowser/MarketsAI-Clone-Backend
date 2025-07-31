const {
  TEMPLATE_CONSTANTS,
  TEMPLATE_ERROR_CODES,
} = require("../constants/template.constants");
const { VALIDATION_ERROR_CODES } = require("../constants/validation.constants");

class TemplateValidator {
  static validateName(name) {
    if (!name || typeof name !== "string" || !name.trim()) {
      return {
        field: "name",
        message: TEMPLATE_CONSTANTS.ERRORS.NAME_REQUIRED,
        code: VALIDATION_ERROR_CODES.REQUIRED_FIELD,
      };
    }

    const trimmedName = name.trim();

    if (
      trimmedName.length < TEMPLATE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH ||
      trimmedName.length > TEMPLATE_CONSTANTS.VALIDATION.NAME_MAX_LENGTH
    ) {
      return {
        field: "name",
        message: TEMPLATE_CONSTANTS.ERRORS.INVALID_NAME_LENGTH,
        code: VALIDATION_ERROR_CODES.INVALID_LENGTH,
      };
    }

    if (!TEMPLATE_CONSTANTS.VALIDATION.NAME_REGEX.test(trimmedName)) {
      return {
        field: "name",
        message: "Template name contains invalid characters",
        code: VALIDATION_ERROR_CODES.INVALID_FORMAT,
      };
    }

    return null;
  }

  static validateSubject(subject) {
    if (!subject || typeof subject !== "string" || !subject.trim()) {
      return {
        field: "subject",
        message: TEMPLATE_CONSTANTS.ERRORS.SUBJECT_REQUIRED,
        code: VALIDATION_ERROR_CODES.REQUIRED_FIELD,
      };
    }

    const trimmedSubject = subject.trim();

    if (
      trimmedSubject.length <
        TEMPLATE_CONSTANTS.VALIDATION.SUBJECT_MIN_LENGTH ||
      trimmedSubject.length > TEMPLATE_CONSTANTS.VALIDATION.SUBJECT_MAX_LENGTH
    ) {
      return {
        field: "subject",
        message: TEMPLATE_CONSTANTS.ERRORS.INVALID_SUBJECT_LENGTH,
        code: VALIDATION_ERROR_CODES.INVALID_LENGTH,
      };
    }

    return null;
  }

  static validateContent(content) {
    if (!content || typeof content !== "string" || !content.trim()) {
      return {
        field: "content",
        message: TEMPLATE_CONSTANTS.ERRORS.CONTENT_REQUIRED,
        code: VALIDATION_ERROR_CODES.REQUIRED_FIELD,
      };
    }

    const trimmedContent = content.trim();

    if (
      trimmedContent.length <
        TEMPLATE_CONSTANTS.VALIDATION.CONTENT_MIN_LENGTH ||
      trimmedContent.length > TEMPLATE_CONSTANTS.VALIDATION.CONTENT_MAX_LENGTH
    ) {
      return {
        field: "content",
        message: TEMPLATE_CONSTANTS.ERRORS.INVALID_CONTENT_LENGTH,
        code: VALIDATION_ERROR_CODES.INVALID_LENGTH,
      };
    }

    return null;
  }

  static validateId(id) {
    const mongoose = require("mongoose");

    if (!id) {
      return {
        isValid: false,
        error: TEMPLATE_CONSTANTS.ERRORS.INVALID_ID,
      };
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        isValid: false,
        error: TEMPLATE_CONSTANTS.ERRORS.INVALID_ID,
      };
    }

    return {
      isValid: true,
      id: id.trim(),
    };
  }

  static validateCreateData(data) {
    const errors = [];

    if (!data || typeof data !== "object") {
      errors.push({
        field: "data",
        message: "Invalid data provided",
        code: VALIDATION_ERROR_CODES.INVALID_FORMAT,
      });
      return { isValid: false, errors };
    }

    const { name, subject, content } = data;

    const nameError = this.validateName(name);
    if (nameError) errors.push(nameError);

    const subjectError = this.validateSubject(subject);
    if (subjectError) errors.push(subjectError);

    const contentError = this.validateContent(content);
    if (contentError) errors.push(contentError);

    return {
      isValid: errors.length === 0,
      errors,
      validatedData: {
        name: name?.trim(),
        subject: subject?.trim(),
        content: content?.trim(),
      },
    };
  }

  static validateUpdateData(data) {
    const errors = [];

    if (!data || typeof data !== "object") {
      errors.push({
        field: "data",
        message: "Invalid data provided",
        code: VALIDATION_ERROR_CODES.INVALID_FORMAT,
      });
      return { isValid: false, errors };
    }

    const { name, subject, content } = data;
    const validatedData = {};

    if (name !== undefined) {
      const nameError = this.validateName(name);
      if (nameError) {
        errors.push(nameError);
      } else {
        validatedData.name = name.trim();
      }
    }

    if (subject !== undefined) {
      const subjectError = this.validateSubject(subject);
      if (subjectError) {
        errors.push(subjectError);
      } else {
        validatedData.subject = subject.trim();
      }
    }

    if (content !== undefined) {
      const contentError = this.validateContent(content);
      if (contentError) {
        errors.push(contentError);
      } else {
        validatedData.content = content.trim();
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      validatedData,
    };
  }
}

module.exports = TemplateValidator;
