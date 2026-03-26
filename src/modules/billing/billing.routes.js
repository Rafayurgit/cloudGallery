const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const controller = require("./billing.controller");

const router = express.Router();

router.get("/status", authMiddleware, controller.getStatus);

module.exports = router;
