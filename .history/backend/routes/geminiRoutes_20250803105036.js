import express from "express";
import { testGeminiConnection } from "../controllers/geminiController.js";

const router = express.Router();

// Test route
router.get("/test", testGeminiConnection);

export default router;
