const { AUTH_ERROR_CODES } = require("../constants/auth.constants");
const CommonValidator = require("../utils/commonValidator");

class AuthValidator {
  static validateLoginInput(loginData) {
    const { email, password } = loginData;

    return CommonValidator.collectErrors([
      () => CommonValidator.validateEmail(email),
      () => CommonValidator.validatePassword(password),
    ]);
  }

  static validateUserCreationInput(userData) {
    const { email, password, firstName, lastName, role } = userData;

    return CommonValidator.collectErrors([
      () => CommonValidator.validateEmail(email),
      () => CommonValidator.validatePassword(password),
      () => CommonValidator.validateFirstName(firstName),
      () => CommonValidator.validateLastName(lastName),
      () => CommonValidator.validateRole(role),
    ]);
  }
}

module.exports = AuthValidator;
