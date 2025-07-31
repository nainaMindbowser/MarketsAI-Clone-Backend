const EmailHistoryService = require("../services/emailHistory.service");
const { HTTP_STATUS, ErrorResponse } = require("../utils/responseHelper");

const getEmailHistory = async (req, res) => {
  try {
    const { limit = 50, lastId } = req.query;
    const userId = req.user.id;

    const emailHistoryService = new EmailHistoryService();
    const result = await emailHistoryService.getHistoryByUser(
      userId,
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

const getAllEmailHistory = async (req, res) => {
  try {
    const { limit = 50, lastId, ...filters } = req.query;

    const emailHistoryService = new EmailHistoryService();
    const result = await emailHistoryService.getAllHistory(
      parseInt(limit),
      lastId,
      filters
    );

    return res.status(HTTP_STATUS.OK).json(
      ErrorResponse.success("All email history retrieved successfully", {
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
    console.error("Get all email history error:", error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        ErrorResponse.error(
          error.message || "Failed to get all email history",
          "HISTORY_FETCH_ERROR"
        )
      );
  }
};

const getEmailHistoryStats = async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id;

    const emailHistoryService = new EmailHistoryService();
    const stats = await emailHistoryService.getHistoryStats(userId);

    return res.status(HTTP_STATUS.OK).json(
      ErrorResponse.success("Email history stats retrieved successfully", {
        stats: {
          totalEmails: stats.totalEmails,
          sentEmails: stats.sentEmails,
          deliveredEmails: stats.deliveredEmails,
          failedEmails: stats.failedEmails,
          openedEmails: stats.openedEmails,
          clickedEmails: stats.clickedEmails,
          avgProcessingTime: Math.round(stats.avgProcessingTime || 0),
          deliveryRate:
            stats.totalEmails > 0
              ? Math.round((stats.deliveredEmails / stats.totalEmails) * 100)
              : 0,
          openRate:
            stats.sentEmails > 0
              ? Math.round((stats.openedEmails / stats.sentEmails) * 100)
              : 0,
          clickRate:
            stats.openedEmails > 0
              ? Math.round((stats.clickedEmails / stats.openedEmails) * 100)
              : 0,
        },
      })
    );
  } catch (error) {
    console.error("Get email history stats error:", error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        ErrorResponse.error(
          error.message || "Failed to get email history stats",
          "STATS_FETCH_ERROR"
        )
      );
  }
};

const updateEmailEvent = async (req, res) => {
  try {
    const { messageId, eventType, additionalData } = req.body;

    if (!messageId || !eventType) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          ErrorResponse.error(
            "Message ID and event type are required",
            "MISSING_REQUIRED_FIELDS"
          )
        );
    }

    const emailHistoryService = new EmailHistoryService();
    const updatedRecord = await emailHistoryService.updateEmailEvent(
      messageId,
      eventType,
      additionalData
    );

    if (!updatedRecord) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json(
          ErrorResponse.error(
            "Email history record not found",
            "RECORD_NOT_FOUND"
          )
        );
    }

    return res.status(HTTP_STATUS.OK).json(
      ErrorResponse.success("Email event updated successfully", {
        record: {
          id: updatedRecord._id,
          messageId: updatedRecord.messageId,
          eventType: updatedRecord.eventType,
          deliveryStatus: updatedRecord.deliveryStatus,
          opened: updatedRecord.opened,
          clicked: updatedRecord.clicked,
        },
      })
    );
  } catch (error) {
    console.error("Update email event error:", error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        ErrorResponse.error(
          error.message || "Failed to update email event",
          "EVENT_UPDATE_ERROR"
        )
      );
  }
};

module.exports = {
  getEmailHistory,
  getAllEmailHistory,
  getEmailHistoryStats,
  updateEmailEvent,
};
