const Template = require("../models/Template");
const TemplateValidator = require("../validators/template.validator");
const {
  TEMPLATE_CONSTANTS,
  TEMPLATE_ERROR_CODES,
} = require("../constants/template.constants");

class TemplateService {
  static async createTemplate(templateData, userId) {
    try {
      const validation = TemplateValidator.validateCreateData(templateData);
      if (!validation.isValid) {
        const error = new Error(validation.errors[0].message);
        error.code = TEMPLATE_ERROR_CODES.VALIDATION_ERROR;
        error.errors = validation.errors;
        throw error;
      }

      const { name, subject, content } = validation.validatedData;

      // Removed duplicate name check - allow templates with same names
      // Each template is identified by its unique _id

      const template = new Template({
        name,
        subject,
        content,
        createdBy: userId,
        updatedBy: userId,
      });

      await template.save();
      await template.populate("createdBy", "name email");

      return {
        success: true,
        data: template,
        message: TEMPLATE_CONSTANTS.SUCCESS.TEMPLATE_CREATED,
      };
    } catch (error) {
      // Removed duplicate key error handling - allow templates with same names

      if (
        error.code &&
        typeof error.code === "string" &&
        error.code.startsWith("TEMPLATE_")
      ) {
        throw error;
      }

      throw new Error(error.message || "Failed to create template");
    }
  }

  static async updateTemplate(templateId, updateData, userId) {
    try {
      const idValidation = TemplateValidator.validateId(templateId);
      if (!idValidation.isValid) {
        const error = new Error(idValidation.error);
        error.code = TEMPLATE_ERROR_CODES.VALIDATION_ERROR;
        throw error;
      }

      const validation = TemplateValidator.validateUpdateData(updateData);
      if (!validation.isValid) {
        const error = new Error(validation.errors[0].message);
        error.code = TEMPLATE_ERROR_CODES.VALIDATION_ERROR;
        error.errors = validation.errors;
        throw error;
      }

      const template = await Template.findById(idValidation.id);
      if (!template) {
        const error = new Error(TEMPLATE_CONSTANTS.ERRORS.TEMPLATE_NOT_FOUND);
        error.code = TEMPLATE_ERROR_CODES.NOT_FOUND;
        throw error;
      }

      const { validatedData } = validation;

      // Removed duplicate name check for updates - allow same names
      // Templates are uniquely identified by _id

      Object.assign(template, validatedData);
      template.updatedBy = userId;

      await template.save();
      await template.populate([
        { path: "createdBy", select: "name email" },
        { path: "updatedBy", select: "name email" },
      ]);

      return {
        success: true,
        data: template,
        message: TEMPLATE_CONSTANTS.SUCCESS.TEMPLATE_UPDATED,
      };
    } catch (error) {
      // Removed duplicate key error handling - allow templates with same names

      if (
        error.code &&
        typeof error.code === "string" &&
        error.code.startsWith("TEMPLATE_")
      ) {
        throw error;
      }

      throw new Error(error.message || "Failed to update template");
    }
  }

  static async getTemplates(userId = null) {
    try {
      let query = { isDeleted: { $ne: true } };

      if (userId) {
        query.createdBy = userId;
      }

      const templates = await Template.find(query)
        .sort({ createdAt: -1 })
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .lean();

      return {
        success: true,
        data: templates,
        total: templates.length,
        message: TEMPLATE_CONSTANTS.SUCCESS.TEMPLATES_FETCHED,
      };
    } catch (error) {
      throw new Error("Failed to fetch templates");
    }
  }

  static async deleteTemplate(templateId) {
    try {
      const idValidation = TemplateValidator.validateId(templateId);
      if (!idValidation.isValid) {
        const error = new Error(idValidation.error);
        error.code = TEMPLATE_ERROR_CODES.VALIDATION_ERROR;
        throw error;
      }

      const template = await Template.findById(idValidation.id);
      if (!template) {
        const error = new Error(TEMPLATE_CONSTANTS.ERRORS.TEMPLATE_NOT_FOUND);
        error.code = TEMPLATE_ERROR_CODES.NOT_FOUND;
        throw error;
      }

      if (template.isDeleted) {
        throw new Error("Template is already deleted");
      }

      await template.softDelete();

      return {
        success: true,
        message: TEMPLATE_CONSTANTS.SUCCESS.TEMPLATE_DELETED,
      };
    } catch (error) {
      if (error.code && error.code.startsWith("TEMPLATE_")) {
        throw error;
      }

      throw new Error(error.message || "Failed to delete template");
    }
  }

  static async getTemplateById(templateId, userId) {
    try {
      let query = {
        _id: templateId,
        isDeleted: false,
      };

      if (userId) {
        query.createdBy = userId;
      }

      const template = await Template.findOne(query).populate([
        { path: "createdBy", select: "name email" },
        { path: "updatedBy", select: "name email" },
      ]);

      if (!template) {
        const error = new Error(TEMPLATE_CONSTANTS.ERRORS.NOT_FOUND);
        error.code = TEMPLATE_ERROR_CODES.NOT_FOUND;
        throw error;
      }

      return {
        success: true,
        data: template,
        message: TEMPLATE_CONSTANTS.SUCCESS.TEMPLATE_FETCHED,
      };
    } catch (error) {
      if (
        error.code &&
        typeof error.code === "string" &&
        error.code.startsWith("TEMPLATE_")
      ) {
        throw error;
      }

      throw new Error(error.message || "Failed to fetch template");
    }
  }
}

module.exports = TemplateService;
