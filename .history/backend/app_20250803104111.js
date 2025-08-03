// backend/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import geminiRoutes from "./routes/geminiRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/gemini", geminiRoutes);

// Fallback route
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// // Error Handler
// app.use(errorHandler);

export default app;
