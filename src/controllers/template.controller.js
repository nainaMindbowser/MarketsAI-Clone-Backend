const TemplateService = require("../services/template.service");
const { HTTP_STATUS, ErrorResponse } = require("../utils/responseHelper");
const { TEMPLATE_ERROR_CODES } = require("../constants/template.constants");
const { sendTemplateEmail } = require("./email.controller");

const createOrUpdateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, content } = req.body;
    const userId = req.user.userId;

    let result;

    if (id) {
      result = await TemplateService.updateTemplate(
        id,
        { name, subject, content },
        userId
      );
      return res
        .status(HTTP_STATUS.OK)
        .json(ErrorResponse.success(result.message, result.data));
    } else {
      result = await TemplateService.createTemplate(
        { name, subject, content },
        userId
      );
      return res
        .status(HTTP_STATUS.CREATED)
        .json(ErrorResponse.success(result.message, result.data));
    }
  } catch (error) {
    return handleTemplateError(error, res);
  }
};

const getTemplates = async (req, res) => {
  try {
    const userId = req.user.role === "admin" ? null : req.user.userId;
    const result = await TemplateService.getTemplates(userId);

    return res.status(HTTP_STATUS.OK).json(
      ErrorResponse.success(result.message, result.data, {
        total: result.total,
      })
    );
  } catch (error) {
    return handleTemplateError(error, res);
  }
};

const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TemplateService.deleteTemplate(id);

    return res
      .status(HTTP_STATUS.OK)
      .json(ErrorResponse.success(result.message));
  } catch (error) {
    return handleTemplateError(error, res);
  }
};

const handleTemplateError = (error, res) => {
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let errorResponse;

  if (error.code === TEMPLATE_ERROR_CODES.VALIDATION_ERROR) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    if (error.errors && error.errors.length > 0) {
      errorResponse = ErrorResponse.validationError(error.errors);
    } else {
      errorResponse = ErrorResponse.error(error.message, error.code);
    }
  } else if (error.code === TEMPLATE_ERROR_CODES.DUPLICATE_NAME) {
    statusCode = HTTP_STATUS.CONFLICT;
    errorResponse = ErrorResponse.error(error.message, error.code);
  } else if (error.code === TEMPLATE_ERROR_CODES.NOT_FOUND) {
    statusCode = HTTP_STATUS.NOT_FOUND;
    errorResponse = ErrorResponse.error(error.message, error.code);
  } else {
    errorResponse = ErrorResponse.error(
      error.message || "Internal server error",
      "TEMPLATE_SERVER_ERROR"
    );
  }

  return res.status(statusCode).json(errorResponse);
};

const createTemplate = async (req, res) => {
  return await createOrUpdateTemplate(req, res);
};

const updateTemplate = async (req, res) => {
  return await createOrUpdateTemplate(req, res);
};

const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const result = await TemplateService.getTemplateById(id, userId);

    return res
      .status(200)
      .json(SuccessResponse.success(result.data, result.message));
  } catch (error) {
    return handleTemplateError(error, res);
  }
};

module.exports = {
  createTemplate,
  updateTemplate,
  getTemplates,
  deleteTemplate,
  getTemplateById,
  sendTemplateEmail,
};
