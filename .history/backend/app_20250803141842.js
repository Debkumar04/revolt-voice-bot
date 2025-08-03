// backend/app.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import geminiRoutes from "./routes/geminiRoutes.js";

dotenv.config();
const app = express();

// Proper CORS configuration
app.use(cors({ origin: "http://localhost:5173" }));

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is up and running ✅");
});

// Gemini route
app.use("/api/gemini", geminiRoutes);

export default app;
