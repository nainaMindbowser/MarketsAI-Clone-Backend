const express = require("express");
const router = express.Router();
const { login } = require("../controllers/auth.controller");
const validateLogin = require("../middlewares/validateLogin");

router.post("/login", validateLogin, login);

module.exports = router;
