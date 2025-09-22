import express from "express";
import mongoose from "mongoose";
//import app from "../src/app.js";
import dotenv from "dotenv";
import { server, app } from "./socket/socket.js";
dotenv.config();
import { execSync } from "child_process";
dotenv.config({ path: "./.env.development" });

console.log("PORT:", process.env.PORT);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
console.log(DB);
mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.error("DB connection error:", err));
const HOST = "192.168.0.104";
const PORT = process.env.PORT;
server.listen(process.env.PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
