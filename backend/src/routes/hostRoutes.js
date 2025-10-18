import express from "express";
import {
  registerHost,
  getHostProfile,
  getHostDashboard,
  updateHostProfile,
  getHostEvents
} from "../controllers/hostController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.post("/register", authenticate, registerHost);
router.get("/profile", authenticate, getHostProfile);
router.get("/dashboard", authenticate, getHostDashboard);
router.put("/profile", authenticate, updateHostProfile);
router.get("/events", authenticate, getHostEvents);

export default router;