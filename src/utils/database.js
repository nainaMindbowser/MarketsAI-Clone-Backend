class DatabaseUtils {
  static COLUMN_MAPPING = {
    Email: "email",
    Name: "name",
    "Created At": "createdAt",
    "Updated At": "updatedAt",
    "Is Thanks Email Sent": "isThanksEmailSent",
    "Terms Of Use": "termsOfUse",
    "Last Login Date": "lastLoginDate",
    "Is Email Verified": "isEmailVerified",
    "Is Free Trial Used": "isFreeTrialUsed",
    "Device Type": "deviceType",
    "Subscription Type": "subscriptionType",
    "Subscription Cycle": "subscriptionCycle",
    "Expires On": "expiresOn",
    "Purchase Date": "purchaseDate",
    "Renewal Date": "renewalDate",
  };

  static buildQuery(filters = {}) {
    try {
      const query = {};

      if (!filters || typeof filters !== "object") {
        return query;
      }

      if (filters.subscriptionType) {
        query.subscriptionType = filters.subscriptionType;
      }

      if (filters.deviceType) {
        query.deviceType = filters.deviceType;
      }

      if (filters.search && filters.search.trim()) {
        const searchTerm = filters.search.trim();
        query.$or = [
          { email: { $regex: searchTerm, $options: "i" } },
          { name: { $regex: searchTerm, $options: "i" } },
        ];
      }

      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
          const startDate = new Date(filters.startDate);
          if (!isNaN(startDate.getTime())) {
            // Set to beginning of the day (00:00:00.000)
            startDate.setHours(0, 0, 0, 0);
            query.createdAt.$gte = startDate;
          }
        }
        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          if (!isNaN(endDate.getTime())) {
            // Set to end of the day (23:59:59.999)
            endDate.setHours(23, 59, 59, 999);
            query.createdAt.$lte = endDate;
          }
        }
      }

      return query;
    } catch (error) {
      console.error("DatabaseUtils.buildQuery error:", error);
      return {};
    }
  }

  static buildProjection(columns) {
    try {
      if (!columns) {
        return {};
      }

      const projection = {};
      let columnList = [];

      if (typeof columns === "string") {
        columnList = columns.split(",").map((col) => col.trim());
      } else if (Array.isArray(columns)) {
        columnList = columns;
      } else {
        return {};
      }

      columnList.forEach((frontendColumn) => {
        const dbField = this.COLUMN_MAPPING[frontendColumn];
        if (dbField) {
          projection[dbField] = 1;
        }
      });

      projection._id = 1;
      return projection;
    } catch (error) {
      console.error("DatabaseUtils.buildProjection error:", error);
      return {};
    }
  }

  static buildSort(sortBy = "createdAt", sortOrder = "desc") {
    try {
      const sort = {};
      const field = sortBy || "createdAt";
      const order = sortOrder === "asc" ? 1 : -1;
      sort[field] = order;
      return sort;
    } catch (error) {
      console.error("DatabaseUtils.buildSort error:", error);
      return { createdAt: -1 };
    }
  }
}

module.exports = DatabaseUtils;
