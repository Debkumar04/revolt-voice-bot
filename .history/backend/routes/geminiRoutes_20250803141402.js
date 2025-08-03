// routes/geminiRoutes.js
import express from "express";
import multer from "multer";
import {
  handleVoiceInteraction,
  testGeminiConnection,
} from "../controllers/geminiController.js";

const upload = multer(); // for parsing multipart/form-data
const router = express.Router();

router.get("/test", testGeminiConnection);
router.post("/", upload.single("audio"), handleVoiceInteraction); // <-- Important

export default router;
