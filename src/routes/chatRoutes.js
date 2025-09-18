import express from "express";
import * as authController from "../controllers/authController.js";
import * as messageController from "../controllers/chatController.js";

const Router = express.Router();

// Send a message
Router.post("/send", authController.protect, messageController.sendMessage);

// Get all conversations for logged-in user
Router.get(
  "/conversations",
  authController.protect,
  messageController.getConversations
);

// Get messages with a specific user
Router.get(
  "/messages/:userId",
  authController.protect,
  messageController.getMessagesWithUser
);

export default Router;
