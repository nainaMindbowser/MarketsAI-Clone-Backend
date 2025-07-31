const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const setupMiddleware = require("./config/middleware");
const setupRoutes = require("./config/routes");
const { globalErrorHandler } = require("./utils/errorHandler");
const MESSAGES = require("./constants/messages");

const app = express();

// Initialize application
const initializeApp = async () => {
  try {
    await connectDB();
    console.log(MESSAGES.SERVER.INITIALIZED);
  } catch (error) {
    console.error(MESSAGES.SERVER.INIT_FAILED, error);
    process.exit(1);
  }
};

// middleware
setupMiddleware(app);

// routes
setupRoutes(app);

// Error handling middleware
app.use(globalErrorHandler);

// server
const startServer = async () => {
  await initializeApp();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(MESSAGES.SERVER.STARTED.replace("{port}", PORT));
  });
};

startServer();
