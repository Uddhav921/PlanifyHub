import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { loggingMiddleware, nextMiddleware } from "./middlewares/appMiddleware.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "*",
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));
app.use(express.json());
/// use imported middlewares
app.use(loggingMiddleware);
app.use(nextMiddleware);


// Example route
app.get("/", (req, res) => {
  res.send("Hello from PlanifyHub backend!");
});

export default app;
