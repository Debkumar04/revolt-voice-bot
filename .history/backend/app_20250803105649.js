// backend/app.js
import { configDotenv } from "dotenv";
import express from "express";

configDotenv
const app = express();

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is up and running ✅");
});

export default app;
