// routes/geminiRoutes.js
import express from "express";
import {
  handleVoiceInteraction,
  testGeminiConnection,
} from "../controllers/geminiController.js";

const router = express.Router();

router.get("/test", testGeminiConnection);
router.post("/", handleVoiceInteraction); // No multer needed

export default router;
