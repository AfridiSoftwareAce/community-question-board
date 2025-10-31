import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import questionRoutes from "./routes/questionRoutes.js";

dotenv.config();

const app = express();

// connect DB
await connectDB();

// middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// routes
app.get("/", (req, res) => {
  res.json({ message: "Community Question Board API is running ✅" });
});

app.use("/api/questions", questionRoutes);

// not found
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// error handler
app.use((err, req, res, next) => {
  console.error("🔥 Global error:", err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
