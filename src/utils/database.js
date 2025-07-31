class DatabaseUtils {
  /**
   * Column mapping from frontend names to database field names
   */
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

  /**
   * Build MongoDB filter query from request filters
   * @param {Object} filters - Filter parameters
   * @returns {Object} - MongoDB query object
   */
  static buildQuery(filters = {}) {
    try {
      const query = {};

      // Ensure filters is an object
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
            query.createdAt.$gte = startDate;
          }
        }
        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          if (!isNaN(endDate.getTime())) {
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
  /**
   * Build MongoDB projection from selected columns
   * @param {String|Array} columns - Column names to select (string or array)
   * @returns {Object} - MongoDB projection object
   */
  static buildProjection(columns) {
    try {
      if (!columns) {
        return {};
      }

      const projection = {};
      let columnList = [];

      // Handle both string and array input
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

  /**
   * Build sort options
   * @param {String} sortBy - Field to sort by
   * @param {String} sortOrder - (asc/desc)
   * @returns {Object} - Sort options
   */
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
