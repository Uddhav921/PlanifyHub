import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();

// Enable CORS using origin from .env
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log("🌐 Hostname:", req.hostname);
  console.log("📁 Path:", req.path);
  console.log("📝 Method:", req.method);
  next();
});

app.use((req, res, next) => {
  console.log("➡️ In the next middleware");
  next();
});

// Example route
app.get("/", (req, res) => {
  res.send("Hello from PlanifyHub backend!");
});

export default app;
