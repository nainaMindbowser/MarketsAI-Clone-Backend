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

  async getEmailHistory(limit = 50, lastId = null) {
    try {
      const query = {};

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
      throw new Error(`Failed to get email history: ${error.message}`);
    }
  }
}

module.exports = EmailHistoryService;
