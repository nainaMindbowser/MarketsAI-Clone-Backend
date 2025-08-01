const express = require("express");
const router = express.Router();
const {
  getCustomers,
  getCustomersForInfiniteScroll,
} = require("../controllers/customers.controller");
const { authenticate } = require("../middlewares/auth");

router.get("/", authenticate, getCustomers);
router.get("/infinite-scroll", authenticate, getCustomersForInfiniteScroll);

module.exports = router;
