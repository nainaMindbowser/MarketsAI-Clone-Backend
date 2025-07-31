const MESSAGES = {
  SERVER: {
    STARTED: "Server running on port {port}",
    INITIALIZED: "Application initialized successfully",
    INIT_FAILED: "Application initialization failed:",
  },
  API: {
    NOT_FOUND: "Route not found",
  },
  DATABASE: {
    CONNECTED: "MongoDB connected: {host}",
    ERROR: "Database connection error:",
  },
};

module.exports = MESSAGES;
