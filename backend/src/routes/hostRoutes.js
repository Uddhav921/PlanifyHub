import express from "express";
const router = express.Router();

// Host routes will be implemented here
router.get("/", (req, res) => {
  res.json({ message: "Host routes - Coming soon" });
});

export default router;

