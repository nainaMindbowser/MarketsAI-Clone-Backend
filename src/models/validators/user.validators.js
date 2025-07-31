const { VALIDATION_RULES } = require("../../constants/validation.constants");

const validateEmail = (email) => {
  return VALIDATION_RULES.EMAIL.REGEX.test(email);
};

const validateFirstName = (firstName) => {
  return (
    firstName &&
    firstName.trim().length >= VALIDATION_RULES.FIRST_NAME.MIN_LENGTH &&
    firstName.trim().length <= VALIDATION_RULES.FIRST_NAME.MAX_LENGTH
  );
};

const validateLastName = (lastName) => {
  return (
    lastName &&
    lastName.trim().length >= VALIDATION_RULES.LAST_NAME.MIN_LENGTH &&
    lastName.trim().length <= VALIDATION_RULES.LAST_NAME.MAX_LENGTH
  );
};

module.exports = {
  validateEmail,
  validateFirstName,
  validateLastName,
};
