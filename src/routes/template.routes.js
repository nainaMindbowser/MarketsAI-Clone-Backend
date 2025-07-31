const express = require("express");
const router = express.Router();
const {
  createTemplate,
  updateTemplate,
  getTemplates,
  deleteTemplate,
  getTemplateById,
  sendTemplateEmail,
} = require("../controllers/template.controller");
const { authenticate } = require("../middlewares/auth");

router.use(authenticate);

router.get("/", getTemplates);
router.get("/:id", getTemplateById);
router.post("/", createTemplate);
router.put("/:id", updateTemplate);
router.delete("/:id", deleteTemplate);
router.post("/:id/send-email", sendTemplateEmail);

module.exports = router;
