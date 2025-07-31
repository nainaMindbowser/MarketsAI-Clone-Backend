const bcrypt = require("bcrypt");

// Hash password before saving
const hashPassword = async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
};

// Compare password method
const comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Update last login timestamp
const updateLastLogin = function () {
  this.lastLoginAt = new Date();
  return this.save();
};

module.exports = {
  hashPassword,
  comparePassword,
  updateLastLogin,
};
