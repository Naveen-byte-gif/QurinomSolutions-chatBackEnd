import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { server, app } from "./socket/socket.js";

// Load environment variables
dotenv.config(); // default .env
dotenv.config({ path: "./.env.development" }); // optional development overrides

// Database connection
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log("✅ DB connection successful"))
  .catch((err) => console.error("❌ DB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000; // fallback if PORT not set
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
