// backend/app.js
import dotenv from 'dotenv'
import express from "express";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cor)

// Test route
app.get("/", (req, res) => {
  res.send("Backend is up and running ✅");
});

export default app;
