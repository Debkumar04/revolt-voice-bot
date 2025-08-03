// routes/geminiRoutes.js
import express from "express";
import multer from "multer";
import {
  testGeminiConnection,
  handleVoiceInteraction,
} from "../controllers/geminiController.js";

const router = express.Router();
const upload = multer(); // to handle raw audio file (multipart/form-data)

router.get("/test", testGeminiConnection);
router.post("/voice", upload.single("audio"), handleVoiceInteraction);

export default router;
