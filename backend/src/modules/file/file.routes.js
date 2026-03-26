const express = require("express");
const multer = require("multer");
const authMiddleware = require("../../middleware/auth.middleware");
const controller = require("./file.controller");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", authMiddleware, upload.single("file"), controller.upload);
router.get("/", authMiddleware, controller.list);
router.delete("/:id", authMiddleware, controller.remove);

module.exports = router;
