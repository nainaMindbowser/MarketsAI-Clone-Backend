const express = require("express");
const router = express.Router();
const {
  login,
  createUser,
  updateAdminUser,
} = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth");

router.post("/login", login);
router.post("/create-user", authenticate, createUser);
router.put("/update-admin", authenticate, updateAdminUser);

module.exports = router;
