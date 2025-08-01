const express = require("express");
const router = express.Router();
const {
  createSenderEmail,
  getSenderEmails,
  deleteSenderEmail,
  updateSenderEmailStatus,
} = require("../controllers/senderEmail.controller");
const { authenticate } = require("../middlewares/auth");

// Apply authentication to all routes
router.use(authenticate);

// POST /api/sender-emails - Create new sender email
router.post("/", createSenderEmail);

// GET /api/sender-emails - Get all sender emails
router.get("/", getSenderEmails);

// DELETE /api/sender-emails/:id - Soft delete sender email
router.delete("/:id", deleteSenderEmail);

// PUT /api/sender-emails/:id/status - Update sender email status
router.put("/:id/status", updateSenderEmailStatus);

module.exports = router;
