// backend/app.js
import dotenv from
import express from "express";


const app = express();

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is up and running ✅");
});

export default app;
