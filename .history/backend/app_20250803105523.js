import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import geminiRoutes from "./routes/geminiRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/gemini", geminiRoutes);

// fallback
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
