const SUBSCRIPTION_TYPES = {
  BASIC: "basic",
  PROFESSIONAL: "professional",
  FREE_PRO: "free-pro",
};

const DEVICE_TYPES = {
  WEB: "WEB",
  IOS: "IOS",
  ANDROID: "ANDROID",
};

const CUSTOMERS_CONSTANTS = {
  ERRORS: {
    FETCH_CUSTOMERS: "Error fetching customers",
    INVALID_FILTERS: "Invalid filter parameters",
  },
  SUCCESS: {
    CUSTOMERS_FETCHED: "Customers fetched successfully",
  },
};

module.exports = {
  SUBSCRIPTION_TYPES,
  DEVICE_TYPES,
  CUSTOMERS_CONSTANTS,
};
