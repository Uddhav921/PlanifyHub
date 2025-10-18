import express from "express";
const router = express.Router();

// Booking routes will be implemented here
router.get("/", (req, res) => {
  res.json({ message: "Booking routes - Coming soon" });
});

export default router;


