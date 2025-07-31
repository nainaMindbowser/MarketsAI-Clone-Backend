const SenderEmail = require("../models/SenderEmail");
const SenderEmailValidator = require("../validators/senderEmail.validator");
const {
  SENDER_EMAIL_CONSTANTS,
} = require("../constants/senderEmail.constants");

class SenderEmailService {
  /**
   * Create a new sender email
   * @param {Object} emailData - Email data
   * @returns {Promise<Object>} - Created email
   */
  static async createSenderEmail(emailData) {
    try {
      // Validate input data
      const validation = SenderEmailValidator.validateCreateData(emailData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      const { email } = validation.validatedData;

      // Check if email already exists (including soft deleted)
      const existingEmail = await SenderEmail.findOne({ email }).select(
        "+isDeleted"
      );
      if (existingEmail) {
        if (existingEmail.isDeleted) {
          // Email was previously deleted, don't allow re-creation
          throw new Error(
            "This email address was previously used and cannot be re-added"
          );
        } else {
          throw new Error(SENDER_EMAIL_CONSTANTS.ERRORS.EMAIL_ALREADY_EXISTS);
        }
      }

      // Create new sender email
      const senderEmail = new SenderEmail({ email });
      await senderEmail.save();

      return {
        success: true,
        data: senderEmail,
        message: SENDER_EMAIL_CONSTANTS.SUCCESS.EMAIL_CREATED,
      };
    } catch (error) {
      console.error("SenderEmailService.createSenderEmail error:", error);
      throw new Error(
        error.message || SENDER_EMAIL_CONSTANTS.ERRORS.CREATE_FAILED
      );
    }
  }

  /**
   * Get all active sender emails
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - List of emails
   */
  static async getSenderEmails(options = {}) {
    try {
      const {
        includeDeleted = false,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = options;

      let query = {};
      if (includeDeleted) {
        // Include both active and deleted
        query = {};
      } else {
        // Only active emails (default middleware will handle this)
        query = { isActive: true };
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

      const senderEmails = await SenderEmail.find(query)
        .sort(sortOptions)
        .lean();

      return {
        success: true,
        data: senderEmails,
        total: senderEmails.length,
        message: SENDER_EMAIL_CONSTANTS.SUCCESS.EMAILS_FETCHED,
      };
    } catch (error) {
      console.error("SenderEmailService.getSenderEmails error:", error);
      throw new Error(SENDER_EMAIL_CONSTANTS.ERRORS.FETCH_FAILED);
    }
  }

  /**
   * Soft delete sender email
   * @param {string} id - Email ID
   * @returns {Promise<Object>} - Deletion result
   */
  static async deleteSenderEmail(id) {
    try {
      const validation = SenderEmailValidator.validateId(id);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const senderEmail = await SenderEmail.findById(validation.id);
      if (!senderEmail) {
        throw new Error(SENDER_EMAIL_CONSTANTS.ERRORS.EMAIL_NOT_FOUND);
      }

      if (senderEmail.isDeleted) {
        throw new Error("Email is already deleted");
      }

      await senderEmail.softDelete();

      return {
        success: true,
        message: SENDER_EMAIL_CONSTANTS.SUCCESS.EMAIL_DELETED,
      };
    } catch (error) {
      console.error("SenderEmailService.deleteSenderEmail error:", error);
      throw new Error(
        error.message || SENDER_EMAIL_CONSTANTS.ERRORS.DELETE_FAILED
      );
    }
  }

  /**
   * Update sender email status
   * @param {string} id - Email ID
   * @param {boolean} isActive - Active status
   * @returns {Promise<Object>} - Update result
   */
  static async updateSenderEmailStatus(id, isActive) {
    try {
      const validation = SenderEmailValidator.validateId(id);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const senderEmail = await SenderEmail.findById(validation.id);
      if (!senderEmail) {
        throw new Error(SENDER_EMAIL_CONSTANTS.ERRORS.EMAIL_NOT_FOUND);
      }

      senderEmail.isActive = Boolean(isActive);
      await senderEmail.save();

      return {
        success: true,
        data: senderEmail,
        message: SENDER_EMAIL_CONSTANTS.SUCCESS.EMAIL_UPDATED,
      };
    } catch (error) {
      console.error("SenderEmailService.updateSenderEmailStatus error:", error);
      throw new Error(
        error.message || SENDER_EMAIL_CONSTANTS.ERRORS.UPDATE_FAILED
      );
    }
  }
}

module.exports = SenderEmailService;
