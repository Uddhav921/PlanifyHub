import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

import { loggingMiddleware, nextMiddleware } from "./middlewares/appMiddleware.js"; // added import

const app = express();

// Enable CORS using origin from .env
// ...existing code...
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// use imported middlewares
app.use(loggingMiddleware);
app.use(nextMiddleware);

// Example route
app.get("/", (req, res) => {
  res.send("Hello from PlanifyHub backend!");
});

export default app;