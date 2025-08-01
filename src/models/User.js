const mongoose = require("mongoose");
const {
  validateEmail,
  validateFirstName,
  validateLastName,
} = require("./validators/user.validators");
const {
  hashPassword,
  comparePassword,
  updateLastLogin,
} = require("./methods/user.methods");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validateEmail,
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [30, "First name cannot exceed 30 characters"],
      validate: {
        validator: validateFirstName,
        message: "Please provide a valid first name",
      },
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Last name must be at least 2 characters long"],
      maxlength: [30, "Last name cannot exceed 30 characters"],
      validate: {
        validator: validateLastName,
        message: "Please provide a valid last name",
      },
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

userSchema.index({ isActive: 1 });

userSchema.pre("save", hashPassword);
userSchema.methods.comparePassword = comparePassword;
userSchema.methods.updateLastLogin = updateLastLogin;

const User = mongoose.model("User", userSchema);

module.exports = User;
