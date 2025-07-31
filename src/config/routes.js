const authRoutes = require("../routes/auth.routes");
const customerRoutes = require("../routes/customers.routes");
const templateRoutes = require("../routes/template.routes");
const senderEmailRoutes = require("../routes/senderEmail.routes");
const emailRoutes = require("../routes/email.routes");
const emailHistoryRoutes = require("../routes/emailHistory.routes");

const configureRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/customers", customerRoutes);
  app.use("/api/templates", templateRoutes);
  app.use("/api/sender-email", senderEmailRoutes);
  app.use("/api/email", emailRoutes);
  app.use("/api/email-history", emailHistoryRoutes);
};

module.exports = configureRoutes;
