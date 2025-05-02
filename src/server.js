import express from "express";
import mongoose from "mongoose";
import app from "../src/app.js";
import dotenv from "dotenv";

dotenv.config();
// import { execSync } from "child_process";
// const getCurrentBranch = () => {
//   return execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
// };


// const currentBranch = getCurrentBranch();
// if (currentBranch === "prod") {
//     dotenv.config({ path: "./.env.production" });
//     console.log("Loaded production environment variables.");
// } else {
    dotenv.config({ path: "./.env.development" });
    console.log("Loaded development environment variables.");
//} 
console.log('PORT:', process.env.PORT);  

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
//console.log(DB);
mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful"))
  .catch(err => console.error("DB connection error:", err));

  const PORT = process.env.PORT;
  app.listen(process.env.PORT, () => {
    console.log("server running on port", PORT);
  });

