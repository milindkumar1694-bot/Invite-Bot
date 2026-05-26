const express = require("express");
const http = require("http");
const path = require("path");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const cors = require("cors");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const FRONTEND_URL = process.env.FRONTEND_URL;

const io = new Server(server, {
  maxHttpBufferSize: 2 * 1024 * 1024,
  cors: {
    origin: FRONTEND_URL || true,
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (!FRONTEND_URL) return callback(null, true);
      return origin === FRONTEND_URL
        ? callback(null, true)
        : callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
  })
);

const clientDir = path.join(__dirname, "..", "client");
app.use(express.static(clientDir));

app.post("/api/invite-click", async (req, res) => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.status(500).json({
      success: false,
      error: "missing_telegram_env",
    });
  }

  const timeFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const time = timeFormatter.format(new Date());
  const text = `She clicked the invite button at ${time} IST`;

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
        }),
      }
    );

    const telegramData = await telegramResponse.json().catch(() => ({}));
    if (!telegramResponse.ok || !telegramData.ok) {
      console.error("Telegram sendMessage failed", telegramData);
      return res.status(502).json({
        success: false,
        error: "telegram_failed",
      });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Telegram request error", error);
    return res.status(500).json({
      success: false,
      error: "telegram_error",
    });
  }
});

const MAX_MESSAGE_LENGTH = 500;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const rooms = new Map();

const normalizeRoomId = (roomId = "") =>
  roomId.toString().trim().toLowerCase().slice(0, 32);

const estimateBase64Bytes = (dataUrl = "") => {
  const base64Part = dataUrl.split(",")[1] || "";
  return Math.floor((base64Part.length * 3) / 4);
};

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId }) => {
    const safeRoomId = normalizeRoomId(roomId);
    if (!safeRoomId) {
      socket.emit("room-error", { message: "Room code is required." });
      return;
    }

    const currentRoom = rooms.get(safeRoomId) || new Set();
    if (currentRoom.size >= 2) {
      socket.emit("room-full");
      return;
    }

    currentRoom.add(socket.id);
    rooms.set(safeRoomId, currentRoom);
    socket.data.roomId = safeRoomId;
    socket.join(safeRoomId);

    socket.emit("room-joined", {
      roomId: safeRoomId,
      count: currentRoom.size,
    });
    io.to(safeRoomId).emit("room-status", { count: currentRoom.size });
  });

  socket.on("chat-message", ({ text }) => {
    const roomId = socket.data.roomId;
    if (!roomId || !rooms.has(roomId)) return;

    const trimmed = (text || "").toString().trim();
    if (!trimmed) return;

    const safeText = trimmed.slice(0, MAX_MESSAGE_LENGTH);
    io.to(roomId).emit("chat-message", {
      text: safeText,
      senderId: socket.id,
      sentAt: Date.now(),
    });
  });

  socket.on("chat-image", ({ dataUrl, name, type, size }) => {
    const roomId = socket.data.roomId;
    if (!roomId || !rooms.has(roomId)) return;

    const safeType = (type || "").toString();
    const safeName = (name || "").toString().slice(0, 80);
    const safeSize = Number(size) || 0;
    const safeDataUrl = (dataUrl || "").toString();

    if (!safeType.startsWith("image/")) {
      socket.emit("room-error", { message: "Only image files are allowed." });
      return;
    }

    if (safeSize <= 0 || safeSize > MAX_IMAGE_BYTES) {
      socket.emit("room-error", { message: "Image is too large." });
      return;
    }

    if (!safeDataUrl.startsWith("data:image/")) {
      socket.emit("room-error", { message: "Invalid image data." });
      return;
    }

    const estimatedBytes = estimateBase64Bytes(safeDataUrl);
    if (estimatedBytes > MAX_IMAGE_BYTES) {
      socket.emit("room-error", { message: "Image is too large." });
      return;
    }

    io.to(roomId).emit("chat-image", {
      dataUrl: safeDataUrl,
      name: safeName,
      senderId: socket.id,
      sentAt: Date.now(),
    });
  });

  socket.on("disconnect", () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const currentRoom = rooms.get(roomId);
    if (!currentRoom) return;

    currentRoom.delete(socket.id);
    if (currentRoom.size === 0) {
      rooms.delete(roomId);
    } else {
      io.to(roomId).emit("room-status", { count: currentRoom.size });
    }
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(clientDir, "index.html"));
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
