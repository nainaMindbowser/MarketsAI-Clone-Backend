const customersService = require("../services/customers.service");
const { ValidationUtils } = require("../validators/validation");
const { catchAsync } = require("../utils/errorHandler");
const { CUSTOMERS_CONSTANTS } = require("../constants/customers.constants");

const getCustomers = catchAsync(async (req, res) => {
  const validation = ValidationUtils.validateFilterParams(req.query);
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: CUSTOMERS_CONSTANTS.ERRORS.INVALID_FILTERS,
      errors: validation.errors,
    });
  }

  const {
    columns,
    subscriptionType,
    deviceType,
    search,
    startDate,
    endDate,
    sortBy,
    sortOrder,
    limit,
    lastId,
    page,
  } = req.query;

  const filters = {
    columns: columns,
    subscriptionType:
      ValidationUtils.normalizeSubscriptionType(subscriptionType),
    deviceType: ValidationUtils.normalizeDeviceType(deviceType),
    search: ValidationUtils.sanitizeString(search),
    startDate,
    endDate,
    sortBy,
    sortOrder,
    limit: parseInt(limit) || 20,
    lastId,
    page: parseInt(page) || 1,
  };

  Object.keys(filters).forEach((key) => {
    if (filters[key] === undefined) {
      delete filters[key];
    }
  });

  const result = await customersService.getCustomers(filters);

  return res.status(200).json({
    success: true,
    message: CUSTOMERS_CONSTANTS.SUCCESS.CUSTOMERS_FETCHED,
    data: result.data,
    pagination: {
      total: result.total,
      hasMore: result.hasMore,
      lastId: result.lastId,
      currentPage: filters.page || 1,
      limit: filters.limit,
      totalPages: Math.ceil(result.total / filters.limit),
    },
    filters,
  });
});

const getCustomersForInfiniteScroll = catchAsync(async (req, res) => {
  const validation = ValidationUtils.validateFilterParams(req.query);
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: CUSTOMERS_CONSTANTS.ERRORS.INVALID_FILTERS,
      errors: validation.errors,
    });
  }

  const {
    columns,
    subscriptionType,
    deviceType,
    search,
    startDate,
    endDate,
    sortBy,
    sortOrder,
    limit,
    lastId,
  } = req.query;

  const filters = {
    columns: columns,
    subscriptionType:
      ValidationUtils.normalizeSubscriptionType(subscriptionType),
    deviceType: ValidationUtils.normalizeDeviceType(deviceType),
    search: ValidationUtils.sanitizeString(search),
    startDate,
    endDate,
    sortBy,
    sortOrder,
    limit: parseInt(limit) || 15,
    lastId,
  };

  Object.keys(filters).forEach((key) => {
    if (filters[key] === undefined) {
      delete filters[key];
    }
  });

  const result = await customersService.getCustomersForInfiniteScroll(filters);

  return res.status(200).json({
    success: true,
    message: CUSTOMERS_CONSTANTS.SUCCESS.CUSTOMERS_FETCHED,
    data: result.data,
    hasMore: result.hasMore,
    lastId: result.lastId,
    totalCount: result.total,
    currentBatchSize: result.data.length,
  });
});

module.exports = {
  getCustomers,
  getCustomersForInfiniteScroll,
};
