import express from "express";
const router = express.Router();

// Admin routes will be implemented here
router.get("/", (req, res) => {
  res.json({ message: "Admin routes - Coming soon" });
});

export default router;


