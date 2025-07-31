const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const {
  getEmailHistory,
  getAllEmailHistory,
  getEmailHistoryStats,
  updateEmailEvent,
} = require("../controllers/emailHistory.controller");

// Get user's email history (authenticated users)
router.get("/my-history", authenticate, getEmailHistory);

// Get all email history (admin only)
router.get("/all", authenticate, getAllEmailHistory);

// Get email history statistics
router.get("/stats", authenticate, getEmailHistoryStats);

// Update email event (for webhooks or manual updates)
router.put("/update-event", authenticate, updateEmailEvent);

module.exports = router;
