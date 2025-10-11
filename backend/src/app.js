// ...existing code...
import express from "express";
const app = express();

// Add this route for root URL
app.get("/", (req, res) => {
  res.send("Welcome!ssd 🚀");
});

// ...existing code...
export default app;