const mongoose = require("mongoose");
const {
  validateTemplateName,
  validateSubject,
  validateContent,
} = require("./validators/template.validators");
const {
  performSoftDelete,
  excludeDeletedTemplates,
} = require("./methods/template.methods");
const { TEMPLATE_CONSTANTS } = require("../constants/template.constants");

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, TEMPLATE_CONSTANTS.ERRORS.NAME_REQUIRED],
      trim: true,
      minlength: [
        TEMPLATE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH,
        TEMPLATE_CONSTANTS.ERRORS.INVALID_NAME_LENGTH,
      ],
      maxlength: [
        TEMPLATE_CONSTANTS.VALIDATION.NAME_MAX_LENGTH,
        TEMPLATE_CONSTANTS.ERRORS.INVALID_NAME_LENGTH,
      ],
      validate: {
        validator: validateTemplateName,
        message: "Template name contains invalid characters",
      },
    },
    subject: {
      type: String,
      required: [true, TEMPLATE_CONSTANTS.ERRORS.SUBJECT_REQUIRED],
      trim: true,
      minlength: [
        TEMPLATE_CONSTANTS.VALIDATION.SUBJECT_MIN_LENGTH,
        TEMPLATE_CONSTANTS.ERRORS.INVALID_SUBJECT_LENGTH,
      ],
      maxlength: [
        TEMPLATE_CONSTANTS.VALIDATION.SUBJECT_MAX_LENGTH,
        TEMPLATE_CONSTANTS.ERRORS.INVALID_SUBJECT_LENGTH,
      ],
      validate: {
        validator: validateSubject,
        message: "Please provide a valid subject",
      },
    },
    content: {
      type: String,
      required: [true, TEMPLATE_CONSTANTS.ERRORS.CONTENT_REQUIRED],
      minlength: [
        TEMPLATE_CONSTANTS.VALIDATION.CONTENT_MIN_LENGTH,
        TEMPLATE_CONSTANTS.ERRORS.INVALID_CONTENT_LENGTH,
      ],
      maxlength: [
        TEMPLATE_CONSTANTS.VALIDATION.CONTENT_MAX_LENGTH,
        TEMPLATE_CONSTANTS.ERRORS.INVALID_CONTENT_LENGTH,
      ],
      validate: {
        validator: validateContent,
        message: "Please provide valid template content",
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

templateSchema.index({ createdBy: 1 });
templateSchema.index({ createdAt: -1 });

templateSchema.pre(/^find/, excludeDeletedTemplates);
templateSchema.methods.softDelete = performSoftDelete;

const Template = mongoose.model("Template", templateSchema);

module.exports = Template;
