const EmailHistoryService = require("../services/emailHistory.service");
const { HTTP_STATUS, ErrorResponse } = require("../utils/responseHelper");

const getEmailHistory = async (req, res) => {
  try {
    const { limit = 50, lastId } = req.query;

    const emailHistoryService = new EmailHistoryService();
    const result = await emailHistoryService.getEmailHistory(
      parseInt(limit),
      lastId
    );

    return res.status(HTTP_STATUS.OK).json(
      ErrorResponse.success("Email history retrieved successfully", {
        history: result.history.map((record) => ({
          id: record._id,
          sender: record.sender,
          recipient: record.recipient,
          subject: record.subject,
          eventType: record.eventType,
          deliveryStatus: record.deliveryStatus,
          opened: record.opened,
          clicked: record.clicked,
          sentAt: record.sentAt,
          smtpResponse: record.smtpResponse,
          processingTime: record.processingTime,
          user: record.user,
          templateName: record.templateId?.name || "Custom Email",
          emailType: record.emailType,
          subscriptionType: record.subscriptionType,
        })),
        hasMore: result.hasMore,
        lastId: result.lastId,
      })
    );
  } catch (error) {
    console.error("Get email history error:", error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        ErrorResponse.error(
          error.message || "Failed to get email history",
          "HISTORY_FETCH_ERROR"
        )
      );
  }
};

module.exports = {
  getEmailHistory,
};
