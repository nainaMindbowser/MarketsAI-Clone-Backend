const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const { getEmailHistory } = require("../controllers/emailHistory.controller");

// Get all email history with on-scroll pagination
router.get("/", authenticate, getEmailHistory);

module.exports = router;
