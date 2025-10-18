import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { loggingMiddleware, nextMiddleware } from "./middlewares/appMiddleware.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import hostRoutes from "./routes/hostRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "*",
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(loggingMiddleware);
app.use(nextMiddleware);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/host", hostRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🚀 lanifyHub Backend API is running!");
});

export default app;