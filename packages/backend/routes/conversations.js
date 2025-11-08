import express from "express";
import { loadJsonFile } from "../utils/static.js";
const router = express.Router();

// GET /api/conversations - Get all conversations
router.get("/", async (req, res) => {
  const conversations = await loadJsonFile("inbox/conversations.json");
  conversations.forEach((conv) => {
    conv.name = conv.name.toUpperCase();
  });
  res.json(conversations);
});

// GET /api/conversations/:id - Get conversation details and messages
router.get("/:id", async (req, res) => {
  const conversationId = req.params.id;
  const conversations = await loadJsonFile("inbox/conversations.json");
  const messagesByConversation = await loadJsonFile(
    "inbox/messagesByConversation.json",
  );

  // Find the conversation
  const conversation = conversations.find((conv) => conv.id === conversationId);

  if (!conversation) {
    return res.status(404).json({
      error: "Conversation not found",
      message: `Conversation with id ${conversationId} does not exist`,
    });
  }

  conversation.name = conversation.name.toUpperCase();

  // Get messages for this conversation
  const messages = messagesByConversation[conversationId] || [];
  messages.forEach((message) => {
    message.user = message.user.toUpperCase();
  });

  // Return conversation details with messages
  res.json({
    conversation,
    messages,
  });
});

export default router;
