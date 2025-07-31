const EmailHistory = require("../models/EmailHistory");

class EmailHistoryService {
  async createHistoryRecord(data) {
    try {
      const historyRecord = new EmailHistory(data);
      await historyRecord.save();
      return historyRecord;
    } catch (error) {
      throw new Error(`Failed to create history record: ${error.message}`);
    }
  }

  async updateHistoryRecord(messageId, updates) {
    try {
      const updatedRecord = await EmailHistory.findOneAndUpdate(
        { messageId },
        updates,
        { new: true }
      );
      return updatedRecord;
    } catch (error) {
      throw new Error(`Failed to update history record: ${error.message}`);
    }
  }

  async getHistoryByUser(userId, limit = 50, lastId = null) {
    try {
      const query = { user: userId };
      
      if (lastId) {
        query._id = { $lt: lastId };
      }

      const history = await EmailHistory.find(query)
        .populate("user", "firstName lastName email")
        .populate("templateId", "name")
        .sort({ sentAt: -1 })
        .limit(limit);

      return {
        history,
        hasMore: history.length === limit,
        lastId: history.length > 0 ? history[history.length - 1]._id : null,
      };
    } catch (error) {
      throw new Error(`Failed to get history: ${error.message}`);
    }
  }

  async getAllHistory(limit = 50, lastId = null, filters = {}) {
    try {
      const query = {};

      if (lastId) {
        query._id = { $lt: lastId };
      }

      if (filters.recipient) {
        query.recipient = { $regex: filters.recipient, $options: "i" };
      }

      if (filters.subject) {
        query.subject = { $regex: filters.subject, $options: "i" };
      }

      if (filters.eventType) {
        query.eventType = filters.eventType;
      }

      if (filters.deliveryStatus) {
        query.deliveryStatus = filters.deliveryStatus;
      }

      if (filters.emailType) {
        query.emailType = filters.emailType;
      }

      if (filters.subscriptionType) {
        query.subscriptionType = filters.subscriptionType;
      }

      if (filters.dateFrom || filters.dateTo) {
        query.sentAt = {};
        if (filters.dateFrom) {
          query.sentAt.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          query.sentAt.$lte = new Date(filters.dateTo);
        }
      }

      const history = await EmailHistory.find(query)
        .populate("user", "firstName lastName email")
        .populate("templateId", "name")
        .sort({ sentAt: -1 })
        .limit(limit);

      return {
        history,
        hasMore: history.length === limit,
        lastId: history.length > 0 ? history[history.length - 1]._id : null,
      };
    } catch (error) {
      throw new Error(`Failed to get all history: ${error.message}`);
    }
  }

  async getHistoryStats(userId = null) {
    try {
      const query = userId ? { user: userId } : {};

      const stats = await EmailHistory.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalEmails: { $sum: 1 },
            sentEmails: {
              $sum: { $cond: [{ $eq: ["$deliveryStatus", "sent"] }, 1, 0] },
            },
            deliveredEmails: {
              $sum: {
                $cond: [{ $eq: ["$deliveryStatus", "delivered"] }, 1, 0],
              },
            },
            failedEmails: {
              $sum: { $cond: [{ $eq: ["$deliveryStatus", "failed"] }, 1, 0] },
            },
            openedEmails: {
              $sum: { $cond: [{ $eq: ["$opened", true] }, 1, 0] },
            },
            clickedEmails: {
              $sum: { $cond: [{ $eq: ["$clicked", true] }, 1, 0] },
            },
            avgProcessingTime: { $avg: "$processingTime" },
          },
        },
      ]);

      return (
        stats[0] || {
          totalEmails: 0,
          sentEmails: 0,
          deliveredEmails: 0,
          failedEmails: 0,
          openedEmails: 0,
          clickedEmails: 0,
          avgProcessingTime: 0,
        }
      );
    } catch (error) {
      throw new Error(`Failed to get history stats: ${error.message}`);
    }
  }

  async updateEmailEvent(messageId, eventType, additionalData = {}) {
    try {
      const updates = {
        eventType,
        ...additionalData,
      };

      if (eventType === "delivered") {
        updates.deliveryStatus = "delivered";
      } else if (eventType === "opened") {
        updates.opened = true;
      } else if (eventType === "clicked") {
        updates.clicked = true;
      } else if (eventType === "bounced" || eventType === "failed") {
        updates.deliveryStatus = eventType;
      }

      const updatedRecord = await EmailHistory.findOneAndUpdate(
        { messageId },
        updates,
        { new: true }
      );

      return updatedRecord;
    } catch (error) {
      throw new Error(`Failed to update email event: ${error.message}`);
    }
  }
}

module.exports = EmailHistoryService;
