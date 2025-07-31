const authRoutes = require("../routes/auth.routes");
const customerRoutes = require("../routes/customers.routes");
const MESSAGES = require("../constants/messages");

const setupRoutes = (app) => {
  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/customers", customerRoutes);

  // 404 handler for unmatched routes
  app.use("*", (req, res) => {
    res.status(404).json({
      status: "error",
      message: `${MESSAGES.API.NOT_FOUND}: ${req.originalUrl}`,
    });
  });
};

module.exports = setupRoutes;
