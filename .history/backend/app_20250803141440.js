// backend/app.js
import dotenv from 'dotenv'
import express from "express";
import cors from 'cors'
import geminiRoutes from './routes/geminiRoutes.js'

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test route

app.get("/", (req, res) => {
  res.send("Backend is up and running ✅");
});

app.use("/api/gemini", geminiRoutes);

export default app;
