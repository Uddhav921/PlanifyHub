import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { loggingMiddleware, nextMiddleware } from "./middlewares/appMiddleware.js";

dotenv.config();

const app = express();

// EJS setup
app.set("view engine", "ejs");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views")); // tell Express where views are

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "*",
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(loggingMiddleware);
app.use(nextMiddleware);

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Route to render EJS page
app.get("/", (req, res) => {
  res.render("index");  // Express automatically looks for index.ejs in 'views'
});

app.get("/login", (req, res) => {
  res.render("login"); // renders login.ejs
});

app.get("/create-event", (req, res) => {
  res.render("create-event"); // renders create-event.ejs
});

export default app;
