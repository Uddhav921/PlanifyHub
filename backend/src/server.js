import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Uddhav:sharda1234@mongocode.5v3yz92.mongodb.net/PlanifyHub?retryWrites=true&w=majority";
console.log("🌟 Starting PlanifyHub Backend...");

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log("🎉 PlanifyHub backend is up and running!");
      console.log(`🔗 Access the backend at: http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("❌ DB connection error:", err));