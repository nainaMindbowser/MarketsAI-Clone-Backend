const express = require("express");
const router = express.Router();
const {
  sendTemplateEmail,
  getCustomersBySubscriptionType,
  getAllCustomers,
} = require("../controllers/email.controller");
const { authenticate } = require("../middlewares/auth");

router.use(authenticate);

// Send template email
router.post("/send-template", sendTemplateEmail);

// Get customers by subscription type
router.get("/customers/subscription-type", getCustomersBySubscriptionType);

// Get all customers grouped by subscription type
router.get("/customers/all", getAllCustomers);

module.exports = router;
