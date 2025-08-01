const mongoose = require("mongoose");
const { validateYopmailEmail } = require("./validators/senderEmail.validators");

const senderEmailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate: {
        validator: validateYopmailEmail,
        message: "Email must be a valid yopmail.com address",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
senderEmailSchema.index({ isActive: 1 });

const SenderEmail = mongoose.model("SenderEmail", senderEmailSchema);

module.exports = SenderEmail;
