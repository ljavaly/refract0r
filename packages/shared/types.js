// Shared type definitions for Refract0r
// These can be used by both frontend and backend

/**
 * Video object structure
 */
export const VideoSchema = {
  id: "number|string",
  title: "string",
  description: "string",
  thumbnail: "string",
  channel: "string",
  views: "number",
  duration: "string",
  uploadDate: "string",
  likes: "number",
  dislikes: "number",
};

/**
 * User object structure
 */
export const UserSchema = {
  id: "string",
  username: "string",
  email: "string",
  avatar: "string",
  createdAt: "string",
};

/**
 * Message object structure
 */
export const MessageSchema = {
  id: "string|number",
  user: "string",
  text: "string",
  time: "string",
  avatar: "string?",
  emoji: "string?",
};

/**
 * Conversation object structure
 */
export const ConversationSchema = {
  id: "string",
  name: "string",
  lastMessage: "string",
  time: "string",
  unread: "number?",
  new: "boolean?",
  participants: "number?",
  avatar: "string?",
  isGroup: "boolean?",
  lastMessageTime: "string?",
  status: "string?", // 'online', 'offline', 'away'
};

/**
 * Comment object structure
 */
export const CommentSchema = {
  id: "string",
  user: "string",
  message: "string",
  timestamp: "string",
};

// API Response types
export const ApiResponse = {
  success: "boolean",
  data: "any",
  message: "string?",
  error: "string?",
};

// Environment variables that should be available
export const RequiredEnvVars = ["PORT", "NODE_ENV"];

export const OptionalEnvVars = [
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "JWT_SECRET",
  "YOUTUBE_API_KEY",
];
