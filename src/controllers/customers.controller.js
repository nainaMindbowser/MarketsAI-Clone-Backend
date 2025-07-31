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
  } = req.query;

  const filters = {
    columns: columns ? columns.split(",") : undefined,
    subscriptionType:
      ValidationUtils.normalizeSubscriptionType(subscriptionType),
    deviceType: ValidationUtils.normalizeDeviceType(deviceType),
    search: ValidationUtils.sanitizeString(search),
    startDate,
    endDate,
    sortBy,
    sortOrder,
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
    total: result.total,
    filters,
  });
});

module.exports = {
  getCustomers,
};
