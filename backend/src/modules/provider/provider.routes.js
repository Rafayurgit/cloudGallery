const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const controller = require("./provider.controller");

const router = express.Router();

router.get("/google/auth-url", authMiddleware, controller.getGoogleAuthUrl);
router.get("/google/callback", controller.handleGoogleCallback);

module.exports = router;
