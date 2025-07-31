const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isThanksEmailSent: {
      type: Boolean,
      default: false,
    },
    termsOfUse: {
      type: Boolean,
      default: false,
    },
    lastLoginDate: {
      type: Date,
      default: Date.now,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isFreeTrialUsed: {
      type: Boolean,
      default: false,
    },
    deviceType: {
      type: String,
      enum: ["WEB", "IOS", "ANDROID"],
      required: true,
    },
    subscriptionType: {
      type: String,
      enum: ["basic", "professional", "free-pro"],
      required: true,
    },
    subscriptionCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },
    expiresOn: {
      type: Date,
    },
    purchaseDate: {
      type: Date,
    },
    renewalDate: {
      type: Date,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  }
);

// Index for better query performance (removing duplicate email index)
customerSchema.index({ subscriptionType: 1 });
customerSchema.index({ deviceType: 1 });
customerSchema.index({ createdAt: 1 });

module.exports = mongoose.model("Customer", customerSchema);
