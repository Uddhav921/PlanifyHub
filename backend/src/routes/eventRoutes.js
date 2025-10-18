import express from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getHostEvents
} from "../controllers/eventController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllEvents); // Get all events with filters
router.get("/:id", getEventById); // Get single event

// Protected routes (host only)
router.post("/", authenticate, createEvent); // Create event
router.put("/:id", authenticate, updateEvent); // Update event
router.delete("/:id", authenticate, deleteEvent); // Delete event
router.get("/host/my-events", authenticate, getHostEvents); // Get host's events

export default router;