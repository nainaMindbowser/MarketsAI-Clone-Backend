const nodemailer = require("nodemailer");
const Customer = require("../models/Customer");
const TemplateService = require("./template.service");
const EmailHistoryService = require("./emailHistory.service");
require("dotenv");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    this.emailHistoryService = new EmailHistoryService();
  }

  async sendEmail(to, subject, content, userId = null, additionalData = {}) {
    const startTime = Date.now();
    let historyRecord = null;

    try {
      const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        html: content,
      };

      const result = await this.transporter.sendMail(mailOptions);
      const processingTime = Date.now() - startTime;

      // Create history record
      if (userId) {
        historyRecord = await this.emailHistoryService.createHistoryRecord({
          sender: mailOptions.from,
          recipient: to,
          subject: subject,
          eventType: "sent",
          deliveryStatus: "sent",
          sentAt: new Date(),
          smtpResponse: result.response || "Email sent successfully",
          processingTime: processingTime,
          user: userId,
          messageId: result.messageId,
          ...additionalData,
        });
      }

      return {
        success: true,
        messageId: result.messageId,
        processingTime: processingTime,
        historyRecord: historyRecord,
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;

      // Create history record for failed email
      if (userId) {
        try {
          await this.emailHistoryService.createHistoryRecord({
            sender: "naina.premani@mindbowser.com",
            recipient: to,
            subject: subject,
            eventType: "failed",
            deliveryStatus: "failed",
            sentAt: new Date(),
            smtpResponse: error.message,
            processingTime: processingTime,
            user: userId,
            errorMessage: error.message,
            ...additionalData,
          });
        } catch (historyError) {
          console.error("Failed to create history record:", historyError);
        }
      }

      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendBulkEmails(
    emails,
    subject,
    content,
    userId = null,
    additionalData = {},
    concurrencyLimit = 10
  ) {
    try {
      const results = [];
      const errors = [];
      const historyRecords = [];

      // Process emails in batches for parallel sending
      const processBatch = async (batch) => {
        const batchPromises = batch.map(async (email) => {
          try {
            const result = await this.sendEmail(
              email,
              subject,
              content,
              userId,
              additionalData
            );
            return {
              email,
              success: true,
              messageId: result.messageId,
              processingTime: result.processingTime,
              historyRecord: result.historyRecord,
            };
          } catch (error) {
            return {
              email,
              success: false,
              error: error.message,
            };
          }
        });

        return await Promise.all(batchPromises);
      };

      // Split emails into batches based on concurrency limit
      const batches = [];
      for (let i = 0; i < emails.length; i += concurrencyLimit) {
        batches.push(emails.slice(i, i + concurrencyLimit));
      }

      // Process batches sequentially but emails within each batch in parallel
      for (const batch of batches) {
        const batchResults = await processBatch(batch);

        for (const result of batchResults) {
          if (result.success) {
            results.push({
              email: result.email,
              success: true,
              messageId: result.messageId,
              processingTime: result.processingTime,
            });
            if (result.historyRecord) {
              historyRecords.push(result.historyRecord);
            }
          } else {
            errors.push({ email: result.email, error: result.error });
          }
        }
      }

      return {
        success: true,
        sent: results.length,
        failed: errors.length,
        results,
        errors,
        historyRecords,
      };
    } catch (error) {
      throw new Error(`Bulk email sending failed: ${error.message}`);
    }
  }

  async getCustomersBySubscriptionType(subscriptionType) {
    try {
      let query = {};

      if (subscriptionType === "both") {
        query = {
          subscriptionType: { $in: ["basic", "professional"] },
        };
      } else if (subscriptionType === "basic") {
        query = { subscriptionType: "basic" };
      } else if (subscriptionType === "professional") {
        query = { subscriptionType: "professional" };
      }

      const customers = await Customer.find(query).select("email name");
      return customers;
    } catch (error) {
      throw new Error(`Failed to get customers: ${error.message}`);
    }
  }

  async sendTemplateEmail(
    templateId,
    emailType,
    subscriptionType = null,
    individualEmails = [],
    customSubject = null,
    customContent = null,
    userId = null
  ) {
    try {
      const template = await TemplateService.getTemplateById(templateId);

      if (!template || !template.data) {
        throw new Error("Template not found");
      }

      // Use custom subject/content if provided, otherwise use template
      const emailSubject = customSubject || template.data.subject;
      const emailContent = customContent || template.data.content;

      if (!emailSubject || !emailContent) {
        throw new Error("Email subject and content are required");
      }

      let emails = [];

      if (emailType === "customer-type") {
        if (!subscriptionType) {
          throw new Error(
            "Subscription type is required for customer-type emails"
          );
        }

        const customers = await this.getCustomersBySubscriptionType(
          subscriptionType
        );
        emails = customers.map((customer) => customer.email);
      } else if (emailType === "individual") {
        if (!individualEmails || individualEmails.length === 0) {
          throw new Error(
            "Individual emails are required for individual email sending"
          );
        }
        emails = individualEmails;
      } else {
        throw new Error("Invalid email type");
      }

      if (emails.length === 0) {
        return {
          success: true,
          message: "No emails to send",
          sent: 0,
          failed: 0,
        };
      }

      const additionalData = {
        templateId: templateId,
        emailType: emailType,
        subscriptionType: subscriptionType,
      };

      // Use higher concurrency for customer-type emails
      const concurrencyLimit = emailType === "customer-type" ? 15 : 10;

      const result = await this.sendBulkEmails(
        emails,
        emailSubject,
        emailContent,
        userId,
        additionalData,
        concurrencyLimit
      );

      return {
        success: true,
        message: `Email sent successfully to ${result.sent} recipients`,
        sent: result.sent,
        failed: result.failed,
        total: emails.length,
        results: result.results,
        errors: result.errors,
        historyRecords: result.historyRecords,
      };
    } catch (error) {
      throw new Error(`Template email sending failed: ${error.message}`);
    }
  }
}

module.exports = EmailService;
