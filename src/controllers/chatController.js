import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import {
  io,
  getReceiverSocketId,
  sendNotificationToUser,
} from "../socket/socket.js";

// ------------------------------
// Send a message (create conversation if not exists)
// ------------------------------
export const sendMessage = catchAsync(async (req, res, next) => {
  const { receiver, content } = req.body;
  const sender = req.user._id; // Sender comes from logged-in user
  const senderName = req.user.name;

  if (!receiver || !content) {
    return res.status(400).json({
      status: "failed",
      message: "Receiver and content are required.",
    });
  }

  // Find existing conversation between sender and receiver
  let conversation = await Conversation.findOne({
    participants: { $all: [sender, receiver] },
  });

  // Create conversation if it doesn't exist
  if (!conversation) {
    conversation = new Conversation({ participants: [sender, receiver] });
    await conversation.save();
  }

  // Save the new message
  const newMessage = new Message({
    sender,
    receiver,
    content,
    conversationId: conversation._id,
  });
  await newMessage.save();

  // Update lastMessage in conversation
  conversation.lastMessage = newMessage._id;
  await conversation.save();

  // Emit via Socket.IO
  const receiverSocketIds = getReceiverSocketId(receiver);
  if (receiverSocketIds && receiverSocketIds.length > 0) {
    receiverSocketIds.forEach((socketId) => {
      io.to(socketId).emit("newMessage", newMessage);
    });
  }

  // Send notification
  sendNotificationToUser(receiver, {
    message: `New message from ${senderName}`,
    chatId: conversation._id.toString(),
    content,
  });

  res.status(200).json({
    status: "success",
    message: newMessage,
    conversationId: conversation._id,
  });
});

// ------------------------------
// Get messages between two users
// ------------------------------
export const getMessagesWithUser = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const otherUserId = req.params.userId;

  if (!otherUserId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  // Find conversation between the two users
  const conversation = await Conversation.findOne({
    participants: { $all: [userId, otherUserId] },
  });

  if (!conversation) {
    return res.status(200).json({
      status: "success",
      messages: [], // Return empty array if no conversation exists yet
      conversationId: null,
    });
  }

  const messages = await Message.find({ conversationId: conversation._id })
    .populate("sender", "name email profile")
    .populate("receiver", "name email profile")
    .sort({ timestamp: 1 }); // Oldest first

  res.status(200).json({
    status: "success",
    messages,
    conversationId: conversation._id,
  });
});

// ------------------------------
// Get all conversations for logged-in user
// ------------------------------
export const getConversations = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate("participants", "name email profile")
    .populate({
      path: "lastMessage",
      populate: [
        { path: "sender", select: "name email profile" },
        { path: "receiver", select: "name email profile" },
      ],
    })
    .sort({ updatedAt: -1 });

  res.status(200).json({
    status: "success",
    conversations,
  });
});
