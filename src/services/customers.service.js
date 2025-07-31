const Customer = require("../models/Customer");
const DatabaseUtils = require("../utils/database");
const { CUSTOMERS_CONSTANTS } = require("../constants/customers.constants");

class CustomersService {
  /**
   * Get all customers with optional filters and sorting
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} - Customers data
   */
  async getCustomers(filters = {}) {
    try {
      if (!filters || typeof filters !== "object") {
        filters = {};
      }

      // Build MongoDB query
      const query = DatabaseUtils.buildQuery(filters);

      // Build projection for column selection
      const projection = DatabaseUtils.buildProjection(filters.columns);

      // Build sort options
      const sort = DatabaseUtils.buildSort(filters.sortBy, filters.sortOrder);

      const customers = await Customer.find(query, projection)
        .sort(sort)
        .lean();

      return {
        success: true,
        data: customers,
        total: customers.length,
      };
    } catch (error) {
      console.error("CustomersService.getCustomers error:", error);
      throw new Error(
        `${CUSTOMERS_CONSTANTS.ERRORS.FETCH_CUSTOMERS} ${error.message}`
      );
    }
  }
}

module.exports = new CustomersService();
