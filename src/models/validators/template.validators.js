const { TEMPLATE_CONSTANTS } = require("../../constants/template.constants");

const validateTemplateName = (name) => {
  if (!name || typeof name !== "string") return false;
  const trimmedName = name.trim();
  return (
    trimmedName.length >= TEMPLATE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH &&
    trimmedName.length <= TEMPLATE_CONSTANTS.VALIDATION.NAME_MAX_LENGTH &&
    TEMPLATE_CONSTANTS.VALIDATION.NAME_REGEX.test(trimmedName)
  );
};

const validateSubject = (subject) => {
  if (!subject || typeof subject !== "string") return false;
  const trimmedSubject = subject.trim();
  return (
    trimmedSubject.length >= TEMPLATE_CONSTANTS.VALIDATION.SUBJECT_MIN_LENGTH &&
    trimmedSubject.length <= TEMPLATE_CONSTANTS.VALIDATION.SUBJECT_MAX_LENGTH
  );
};

const validateContent = (content) => {
  if (!content || typeof content !== "string") return false;
  const trimmedContent = content.trim();
  return (
    trimmedContent.length >= TEMPLATE_CONSTANTS.VALIDATION.CONTENT_MIN_LENGTH &&
    trimmedContent.length <= TEMPLATE_CONSTANTS.VALIDATION.CONTENT_MAX_LENGTH
  );
};

module.exports = {
  validateTemplateName,
  validateSubject,
  validateContent,
};
