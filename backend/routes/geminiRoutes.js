// routes/geminiRoutes.js
import express from "express";
import {
  testGeminiConnection,
  handleVoiceInteraction,
} from "../controllers/geminiController.js";

const router = express.Router();

// Test route
router.get("/test", testGeminiConnection);

// Main interaction route
router.post("/", handleVoiceInteraction);

export default router;
