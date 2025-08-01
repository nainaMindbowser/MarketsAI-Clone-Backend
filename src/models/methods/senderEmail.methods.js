// Query middleware
const excludeDeletedEmails = function () {
  if (!this.getQuery().isDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
};

// Soft delete method
const performSoftDelete = function () {
  this.isDeleted = true;
  this.isActive = false;
  this.deletedAt = new Date();
  return this.save();
};

module.exports = {
  excludeDeletedEmails,
  performSoftDelete,
};
