const Customer = require("../models/Customer");
const DatabaseUtils = require("../utils/database");
const { CUSTOMERS_CONSTANTS } = require("../constants/customers.constants");

class CustomersService {
  async getCustomers(filters = {}) {
    try {
      if (!filters || typeof filters !== "object") {
        filters = {};
      }

      const query = DatabaseUtils.buildQuery(filters);
      const projection = DatabaseUtils.buildProjection(filters.columns);
      const sort = DatabaseUtils.buildSort(filters.sortBy, filters.sortOrder);

      const limit = parseInt(filters.limit) || 50;
      const lastId = filters.lastId;

      if (lastId) {
        query._id = { $lt: lastId };
      }

      const customers = await Customer.find(query, projection)
        .sort(sort)
        .limit(limit)
        .lean();

      return {
        success: true,
        data: customers,
        total: customers.length,
        hasMore: customers.length === limit,
        lastId:
          customers.length > 0 ? customers[customers.length - 1]._id : null,
      };
    } catch (error) {
      console.error("CustomersService.getCustomers error:", error);
      throw new Error(
        `${CUSTOMERS_CONSTANTS.ERRORS.FETCH_CUSTOMERS} ${error.message}`
      );
    }
  }

  async getCustomersForInfiniteScroll(filters = {}) {
    try {
      if (!filters || typeof filters !== "object") {
        filters = {};
      }

      const query = DatabaseUtils.buildQuery(filters);
      const projection = DatabaseUtils.buildProjection(filters.columns);
      const sort = DatabaseUtils.buildSort(filters.sortBy, filters.sortOrder);

      const limit = parseInt(filters.limit) || 15;
      const lastId = filters.lastId;

      // Add cursor-based pagination for smooth infinite scroll
      if (lastId) {
        query._id = { $lt: lastId };
      }

      // Get one extra record to determine if there are more records
      const customers = await Customer.find(query, projection)
        .sort(sort)
        .limit(limit + 1)
        .lean();

      const hasMore = customers.length > limit;
      const data = hasMore ? customers.slice(0, limit) : customers;

      // Get total count for the current query (without pagination)
      const totalQuery = DatabaseUtils.buildQuery(filters);
      const totalCount = await Customer.countDocuments(totalQuery);

      return {
        success: true,
        data: data,
        total: totalCount,
        hasMore: hasMore,
        lastId: data.length > 0 ? data[data.length - 1]._id : null,
      };
    } catch (error) {
      console.error(
        "CustomersService.getCustomersForInfiniteScroll error:",
        error
      );
      throw new Error(
        `${CUSTOMERS_CONSTANTS.ERRORS.FETCH_CUSTOMERS} ${error.message}`
      );
    }
  }

  async getTotalCustomersCount(filters = {}) {
    try {
      const query = DatabaseUtils.buildQuery(filters);
      const count = await Customer.countDocuments(query);
      return count;
    } catch (error) {
      console.error("CustomersService.getTotalCustomersCount error:", error);
      throw new Error(
        `${CUSTOMERS_CONSTANTS.ERRORS.FETCH_CUSTOMERS} ${error.message}`
      );
    }
  }
}

module.exports = new CustomersService();
