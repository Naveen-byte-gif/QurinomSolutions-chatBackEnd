import { Server } from "socket.io";
import http from "http";
import app from "../app.js"; // Your Express app
import User from "../models/userModel.js";

// Create HTTP server
const server = http.createServer(app);

// Init Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

// userId => [socketId...]
const userSocketMap = {};
// userId => online/offline
const onlineUsers = {};

// Get socket IDs for a user
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId?.toString()] || [];
};

// Send notification to specific user
export const sendNotificationToUser = (userId, notification) => {
  const socketIds = getReceiverSocketId(userId);
  socketIds.forEach((sid) => {
    io.to(sid).emit("notification", notification);
  });
};

// Emit all users with status
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

// Socket connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (!userId || userId === "undefined") {
    console.warn("❌ No userId in socket handshake");
    return;
  }

  const uid = userId.toString();
  console.log(`✅ User connected: ${uid}, socket: ${socket.id}`);

  // Add socket to map
  if (!userSocketMap[uid]) userSocketMap[uid] = [];
  userSocketMap[uid].push(socket.id);

  // Mark online
  onlineUsers[uid] = true;
  io.emit("userStatusUpdate", { userId: uid, status: "online" });
  emitAllUsersWithStatus();

  // Handle sending message
  socket.on("sendMessage", ({ sender, receiver, text }) => {
    const msg = {
      sender,
      receiver,
      text,
      timestamp: new Date(),
    };

    // Emit to receiver
    const receiverSockets = getReceiverSocketId(receiver);
    receiverSockets.forEach((sid) => {
      io.to(sid).emit("newMessage", msg);
    });

    // Emit to sender (confirmation)
    io.to(socket.id).emit("newMessage", msg);

    console.log(`💬 ${sender} -> ${receiver}: ${text}`);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`❌ Disconnected: ${uid} (socket ${socket.id})`);

    // Remove socket from map
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

export { server, io, app };
