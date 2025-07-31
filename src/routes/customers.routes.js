const express = require("express");
const router = express.Router();
const { getCustomers } = require("../controllers/customers.controller");
const { authenticate } = require("../middlewares/auth");

router.get("/", authenticate, getCustomers);

module.exports = router;
