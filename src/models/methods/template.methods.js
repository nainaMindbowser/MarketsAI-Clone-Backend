const performSoftDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

const excludeDeletedTemplates = function () {
  if (!this.getQuery().isDeleted) {
    this.find({ isDeleted: { $ne: true } });
  }
};

module.exports = {
  performSoftDelete,
  excludeDeletedTemplates,
};
