const mongoose = require("mongoose");

const emailHistorySchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      default: "naina.premani@mindbowser.com",
    },
    recipient: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      enum: ["sent", "delivered", "opened", "clicked", "bounced", "failed"],
      default: "sent",
    },
    deliveryStatus: {
      type: String,
      enum: ["pending", "sent", "delivered", "failed", "bounced"],
      default: "pending",
    },
    opened: {
      type: Boolean,
      default: false,
    },
    clicked: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    smtpResponse: {
      type: String,
      default: "",
    },
    processingTime: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
    },
    emailType: {
      type: String,
      enum: ["customer-type", "individual"],
    },
    subscriptionType: {
      type: String,
      enum: ["basic", "professional", "both"],
    },
    messageId: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

emailHistorySchema.index({ user: 1, sentAt: -1 });
emailHistorySchema.index({ recipient: 1 });
emailHistorySchema.index({ eventType: 1 });
emailHistorySchema.index({ deliveryStatus: 1 });

const EmailHistory = mongoose.model("EmailHistory", emailHistorySchema);

module.exports = EmailHistory;
