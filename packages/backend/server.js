const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// WebSocket server
const wss = new WebSocket.Server({ server, path: "/ws/comments" });

// Store connected clients
const clients = new Set();

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("🔌 New WebSocket connection established");
  clients.add(ws);

  // Send welcome message
  ws.send(
    JSON.stringify({
      type: "connection",
      message: "Connected to comments WebSocket",
      timestamp: new Date().toISOString(),
    }),
  );

  // Handle incoming messages
  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      console.log("📨 Received WebSocket message:", message);

      // Handle different message types
      switch (message.type) {
        case "comment":
          const commentData = {
            type: "new_comment",
            comment: {
              id: Date.now(),
              user: message.user || "Anonymous",
              message: message.message,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          };

          // Broadcast to all connected clients
          clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(commentData));
            }
          });
          break;

        case "ping":
          ws.send(
            JSON.stringify({
              type: "pong",
              timestamp: new Date().toISOString(),
            }),
          );
          break;

        default:
          // Broadcast to all connected clients
          clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(message));
            }
          });
          break;
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Invalid message format",
          timestamp: new Date().toISOString(),
        }),
      );
    }
  });

  // Handle client disconnect
  ws.on("close", () => {
    console.log("🔌 WebSocket connection closed");
    clients.delete(ws);
  });

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    clients.delete(ws);
  });
});

// Import routes
const videoRoutes = require("./routes/videos");
const conversationRoutes = require("./routes/conversations");
const commentRoutes = require("./routes/comments");

// Middleware
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires', 'If-Modified-Since', 'X-Requested-With'],
  exposedHeaders: ['Cache-Control', 'Pragma', 'Expires', 'ETag', 'Last-Modified']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add comprehensive cache control headers to prevent any caching
app.use((req, res, next) => {
  // Disable caching for all routes
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, private',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Last-Modified': new Date().toUTCString(),
    'ETag': `"${Date.now()}-${Math.random()}"`, // Generate unique ETag
    'Vary': '*'
  });
  next();
});

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Refract0r Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Debug endpoint to test cache busting
app.get("/api/debug/cache-test", (req, res) => {
  console.log('Cache test endpoint hit:', {
    timestamp: new Date().toISOString(),
    query: req.query,
    headers: req.headers
  });
  
  res.json({
    message: "Cache test endpoint",
    timestamp: new Date().toISOString(),
    randomValue: Math.random(),
    queryParams: req.query,
    requestHeaders: {
      'cache-control': req.headers['cache-control'],
      'pragma': req.headers['pragma'],
      'if-modified-since': req.headers['if-modified-since']
    }
  });
});

// Use routes
app.use("/api/videos", videoRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/comments", commentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📺 API endpoint: http://localhost:${PORT}/api/videos`);
  console.log(`🔌 WebSocket endpoint: ws://localhost:${PORT}/ws/comments`);
});

module.exports = app;
