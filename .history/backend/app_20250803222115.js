// backend/app.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import geminiRoutes from "./routes/geminiRoutes.js";

dotenv.config();
const app = express();

// CORS setup for Vite frontend
app.use(cors({ origin: "http://localhost:5173" }));

// Middleware
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Backend is up and running ✅");
});

// Routes
app.use("/api/gemini", geminiRoutes);

export default app;
