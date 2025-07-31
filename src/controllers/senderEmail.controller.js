const SenderEmailService = require("../services/senderEmail.service");
const { catchAsync } = require("../utils/errorHandler");
const {
  SENDER_EMAIL_CONSTANTS,
} = require("../constants/senderEmail.constants");

/**
 * Create a new sender email
 * POST /api/sender-emails
 */
const createSenderEmail = catchAsync(async (req, res) => {
  const { email } = req.body;

  const result = await SenderEmailService.createSenderEmail({ email });

  return res.status(201).json({
    success: true,
    message: result.message,
    data: result.data,
  });
});

/**
 * Get all sender emails
 * GET /api/sender-emails
 */
const getSenderEmails = catchAsync(async (req, res) => {
  const { includeDeleted, sortBy, sortOrder } = req.query;

  const options = {
    includeDeleted: includeDeleted === "true",
    sortBy: sortBy || "createdAt",
    sortOrder: sortOrder || "desc",
  };

  const result = await SenderEmailService.getSenderEmails(options);

  return res.status(200).json({
    success: true,
    message: result.message,
    data: result.data,
    total: result.total,
  });
});

/**
 * Soft delete sender email
 * DELETE /api/sender-emails/:id
 */
const deleteSenderEmail = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await SenderEmailService.deleteSenderEmail(id);

  return res.status(200).json({
    success: true,
    message: result.message,
  });
});

/**
 * Update sender email status
 * PUT /api/sender-emails/:id/status
 */
const updateSenderEmailStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const result = await SenderEmailService.updateSenderEmailStatus(id, isActive);

  return res.status(200).json({
    success: true,
    message: result.message,
    data: result.data,
  });
});

module.exports = {
  createSenderEmail,
  getSenderEmails,
  deleteSenderEmail,
  updateSenderEmailStatus,
};
