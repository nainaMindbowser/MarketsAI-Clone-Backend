const mongoose = require("mongoose");
const { validateYopmailEmail } = require("./validators/senderEmail.validators");
const {
  excludeDeletedEmails,
  performSoftDelete,
} = require("./methods/senderEmail.methods");

const senderEmailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validateYopmailEmail,
        message: "Email must be a valid yopmail.com address",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
senderEmailSchema.index({ email: 1 });
senderEmailSchema.index({ isActive: 1, isDeleted: 1 });

// Apply middleware and methods
senderEmailSchema.pre(/^find/, excludeDeletedEmails);
senderEmailSchema.methods.softDelete = performSoftDelete;

const SenderEmail = mongoose.model("SenderEmail", senderEmailSchema);

module.exports = SenderEmail;
