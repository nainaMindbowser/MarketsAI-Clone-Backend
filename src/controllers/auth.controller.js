const { generateToken } = require("../utils/jwt");
const {
  AUTH_MESSAGES,
  AUTH_ERRORS,
  AUTH_ERROR_CODES,
} = require("../constants/auth.constants");
const { HTTP_STATUS, ErrorResponse } = require("../utils/responseHelper");
const UserService = require("../services/user.service");
const AuthValidator = require("../validators/auth.validator");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validation = AuthValidator.validateLoginInput({ email, password });
    if (!validation.isValid) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(ErrorResponse.validationError(validation.errors));
    }

    const authResult = await UserService.authenticateUser(
      email.trim(),
      password
    );

    const token = generateToken({
      userId: authResult.data._id,
      email: authResult.data.email,
      role: authResult.data.role,
    });

    return res
      .status(HTTP_STATUS.OK)
      .json(
        ErrorResponse.success(authResult.message, authResult.data, { token })
      );
  } catch (error) {
    let statusCode = HTTP_STATUS.UNAUTHORIZED;

    switch (error.code) {
      case AUTH_ERROR_CODES.USER_NOT_FOUND:
        statusCode = HTTP_STATUS.NOT_FOUND;
        break;
      case AUTH_ERROR_CODES.ACCOUNT_DISABLED:
        statusCode = HTTP_STATUS.FORBIDDEN;
        break;
      case AUTH_ERROR_CODES.AUTHENTICATION_FAILED:
        statusCode = HTTP_STATUS.UNAUTHORIZED;
        break;
      default:
        statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    }

    return res
      .status(statusCode)
      .json(
        ErrorResponse.authError(
          error.message || AUTH_ERRORS.INVALID_CREDENTIALS,
          error.code || AUTH_ERROR_CODES.SERVER_ERROR
        )
      );
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    if (req.user.role !== "admin") {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json(
          ErrorResponse.authError(
            AUTH_ERRORS.ACCESS_DENIED,
            AUTH_ERROR_CODES.ACCESS_DENIED
          )
        );
    }

    const validation = AuthValidator.validateUserCreationInput({
      email,
      password,
      firstName,
      lastName,
      role,
    });
    if (!validation.isValid) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(ErrorResponse.validationError(validation.errors));
    }

    const result = await UserService.createUser({
      email: email.trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role,
    });

    return res
      .status(HTTP_STATUS.CREATED)
      .json(ErrorResponse.success(result.message, result.data));
  } catch (error) {
    let statusCode = HTTP_STATUS.BAD_REQUEST;

    switch (error.code) {
      case AUTH_ERROR_CODES.USER_EXISTS:
        statusCode = HTTP_STATUS.CONFLICT;
        break;
      case AUTH_ERROR_CODES.VALIDATION_ERROR:
        statusCode = HTTP_STATUS.BAD_REQUEST;
        break;
      default:
        statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    }

    return res
      .status(statusCode)
      .json(
        ErrorResponse.authError(
          error.message || AUTH_ERRORS.SERVER_ERROR,
          error.code || AUTH_ERROR_CODES.SERVER_ERROR
        )
      );
  }
};

const updateAdminUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json(
          ErrorResponse.authError(
            AUTH_ERRORS.ACCESS_DENIED,
            AUTH_ERROR_CODES.ACCESS_DENIED
          )
        );
    }

    const result = await UserService.updateAdminUser();

    return res
      .status(HTTP_STATUS.OK)
      .json(ErrorResponse.success(result.message, result.data));
  } catch (error) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        ErrorResponse.error(
          error.message || "Failed to update admin user",
          "UPDATE_FAILED"
        )
      );
  }
};

module.exports = { login, createUser, updateAdminUser };
