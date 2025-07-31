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
    const query = {};

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
        query.createdAt.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.createdAt.$lte = new Date(filters.endDate);
      }
    }

    return query;
  }

  /**
   * Build MongoDB projection from selected columns
   * @param {Array} columns - Array of frontend column names to select
   * @returns {Object} - MongoDB projection object
   */
  static buildProjection(columns = []) {
    if (!columns || columns.length === 0) {
      return {};
    }

    const projection = {};

    columns.forEach((frontendColumn) => {
      const dbField = this.COLUMN_MAPPING[frontendColumn];
      if (dbField) {
        projection[dbField] = 1;
      }
    });

    projection._id = 1;
    return projection;
  }

  /**
   * Build sort options
   * @param {String} sortBy - Field to sort by
   * @param {String} sortOrder - (asc/desc)
   * @returns {Object} - Sort options
   */
  static buildSort(sortBy = "createdAt", sortOrder = "desc") {
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    return sort;
  }
}

module.exports = DatabaseUtils;
