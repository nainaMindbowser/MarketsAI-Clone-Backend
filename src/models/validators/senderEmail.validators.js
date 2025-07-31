// Yopmail email validation constants and helper
const YOPMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]*yopmail\.com$/;

const validateYopmailEmail = (email) => {
  return YOPMAIL_REGEX.test(email);
};

module.exports = {
  validateYopmailEmail,
  YOPMAIL_REGEX,
};
