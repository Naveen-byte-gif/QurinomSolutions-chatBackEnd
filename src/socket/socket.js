import { Server } from "socket.io";
import http from "http";
import app from "../app.js"; // Express app
import User from "../models/userModel.js";

// Create HTTP server from Express
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

// Map userId => [socketIds]
const userSocketMap = {};
const onlineUsers = {};

// Helper: get socket ids
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId?.toString()] || [];
};

// Send notification
export const sendNotificationToUser = (userId, notification) => {
  const socketIds = getReceiverSocketId(userId);
  socketIds.forEach((sid) => io.to(sid).emit("notification", notification));
};

// Emit all users with online/offline
const emitAllUsersWithStatus = async () => {
  try {
    const users = await User.find({}, "_id name");
    const usersWithStatus = users.map((u) => ({
      userId: u._id.toString(),
      name: u.name,
      status: onlineUsers[u._id.toString()] ? "online" : "offline",
    }));
    io.emit("getOnlineUsers", usersWithStatus);
  } catch (err) {
    console.error("Error fetching users:", err);
  }
};

// Socket connection
io.on("connection", (socket) => {
  console.log("🔗 Socket connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (!userId) return;

  const uid = userId.toString();

  // Map socket
  if (!userSocketMap[uid]) userSocketMap[uid] = [];
  userSocketMap[uid].push(socket.id);

  onlineUsers[uid] = true;
  io.emit("userStatusUpdate", { userId: uid, status: "online" });
  emitAllUsersWithStatus();

  // Send message
  socket.on("sendMessage", ({ sender, receiver, text }) => {
    const msg = { sender, receiver, text, timestamp: new Date() };
    // Send to receiver
    const receiverSockets = getReceiverSocketId(receiver);
    receiverSockets.forEach((sid) => io.to(sid).emit("newMessage", msg));
    // Confirmation to sender
    io.to(socket.id).emit("newMessage", msg);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`❌ Disconnected: ${uid} (${socket.id})`);
    userSocketMap[uid] = (userSocketMap[uid] || []).filter(
      (sid) => sid !== socket.id
    );
    if (userSocketMap[uid].length === 0) {
      delete userSocketMap[uid];
      delete onlineUsers[uid];
      io.emit("userStatusUpdate", { userId: uid, status: "offline" });
      emitAllUsersWithStatus();
    }
  });
});

export { server, io ,app};
