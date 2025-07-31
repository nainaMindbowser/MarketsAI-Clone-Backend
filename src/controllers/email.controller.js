const EmailService = require("../services/email.service");
const { HTTP_STATUS, ErrorResponse } = require("../utils/responseHelper");

const sendTemplateEmail = async (req, res) => {
  try {
    const {
      templateId,
      emailType,
      subscriptionType,
      individualEmails,
      subject,
      content,
    } = req.body;

    if (!templateId) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          ErrorResponse.error("Template ID is required", "MISSING_TEMPLATE_ID")
        );
    }

    if (!emailType || !["customer-type", "individual"].includes(emailType)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          ErrorResponse.error(
            "Valid email type is required",
            "INVALID_EMAIL_TYPE"
          )
        );
    }

    const emailService = new EmailService();
    const userId = req.user.id;

    const result = await emailService.sendTemplateEmail(
      templateId,
      emailType,
      subscriptionType,
      individualEmails,
      subject,
      content,
      userId
    );

    return res.status(HTTP_STATUS.OK).json(
      ErrorResponse.success(result.message, {
        sent: result.sent,
        failed: result.failed,
        total: result.total,
        results: result.results,
        errors: result.errors,
        historyRecords: result.historyRecords,
      })
    );
  } catch (error) {
    console.error("Email sending error:", error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        ErrorResponse.error(
          error.message || "Failed to send emails",
          "EMAIL_SEND_ERROR"
        )
      );
  }
};

const getCustomersBySubscriptionType = async (req, res) => {
  try {
    const { subscriptionType } = req.query;

    if (
      !subscriptionType ||
      !["both", "basic", "professional"].includes(subscriptionType)
    ) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          ErrorResponse.error(
            "Valid subscription type is required",
            "INVALID_SUBSCRIPTION_TYPE"
          )
        );
    }

    const emailService = new EmailService();
    const customers = await emailService.getCustomersBySubscriptionType(
      subscriptionType
    );

    return res.status(HTTP_STATUS.OK).json(
      ErrorResponse.success("Customers retrieved successfully", {
        customers: customers.map((customer) => ({
          email: customer.email,
          name: customer.name,
        })),
        count: customers.length,
        subscriptionType,
      })
    );
  } catch (error) {
    console.error("Get customers error:", error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        ErrorResponse.error(
          error.message || "Failed to get customers",
          "CUSTOMER_FETCH_ERROR"
        )
      );
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const emailService = new EmailService();
    const allCustomers = await emailService.getCustomersBySubscriptionType(
      "both"
    );
    const basicCustomers = await emailService.getCustomersBySubscriptionType(
      "basic"
    );
    const professionalCustomers =
      await emailService.getCustomersBySubscriptionType("professional");

    return res.status(HTTP_STATUS.OK).json(
      ErrorResponse.success("All customers retrieved successfully", {
        all: allCustomers.map((customer) => ({
          email: customer.email,
          name: customer.name,
        })),
        basic: basicCustomers.map((customer) => ({
          email: customer.email,
          name: customer.name,
        })),
        professional: professionalCustomers.map((customer) => ({
          email: customer.email,
          name: customer.name,
        })),
        counts: {
          all: allCustomers.length,
          basic: basicCustomers.length,
          professional: professionalCustomers.length,
        },
      })
    );
  } catch (error) {
    console.error("Get all customers error:", error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(
        ErrorResponse.error(
          error.message || "Failed to get customers",
          "CUSTOMER_FETCH_ERROR"
        )
      );
  }
};

module.exports = {
  sendTemplateEmail,
  getCustomersBySubscriptionType,
  getAllCustomers,
};
