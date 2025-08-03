const express = require("express");
const multer = require("multer");
const { handleVoiceInteraction } = require("../controllers/geminiController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/voice", upload.single("audio"), handleVoiceInteraction);

module.exports = router;
