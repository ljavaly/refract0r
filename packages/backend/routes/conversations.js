import express from "express";
const router = express.Router();

// Mock data for conversations
const conversations = [
  {
    id: "cirno",
    name: "Cirno_tv",
    lastMessage: "sounds good to me",
    time: "5:45pm",
    unread: 2,
    new: true,
    status: "online",
  },
  {
    id: "xxluver69x",
    name: "Xxluver69xX",
    lastMessage: "Hey there stud 😜",
    time: "5:44pm",
    status: "active",
  },
  {
    id: "omgisle",
    name: "OMGEisIe",
    lastMessage: "LOL",
    time: "3:45pm",
    status: "away",
  },
  {
    id: "sharkboi",
    name: "SharkBoi",
    lastMessage: "Thanks buddy.",
    time: "8:26am",
    status: "offline",
  },
  {
    id: "geoff",
    name: "Geoff",
    lastMessage: "hope to see you in the cast friend",
    time: "yesterday",
    status: "offline",
  },
  {
    id: "tehmorag",
    name: "TehMorag",
    lastMessage: "🔥🔥🔥",
    time: "2:36pm",
    status: "online",
  },
  {
    id: "thundercast",
    name: "Thundercast",
    lastMessage: "What's next on the agenda?",
    time: "2:43pm",
    status: "away",
  },
  {
    id: "hjtanchi",
    name: "HJTanchi",
    lastMessage: "Loved ur last stream!",
    time: "2:42pm",
    status: "offline",
  },
];

// Mock data for messages by conversation
const messagesByConversation = {
  xxluver69x: [
    {
      id: 1,
      user: "Xxluver69xX",
      time: "5:45pm",
      text: "Hey there stud 😜",
      avatar: null,
      emoji: null,
    },
  ],
  cirno: [
    {
      id: 1,
      user: "Cirno_tv",
      time: "5:45pm",
      text: "sounds good to me",
      avatar: null,
      emoji: null,
    },
  ],
  omgisle: [
    {
      id: 1,
      user: "OMGEisIe",
      time: "3:45pm",
      text: "LOL",
      avatar: null,
      emoji: null,
    },
  ],
  sharkboi: [
    {
      id: 1,
      user: "SharkBoi",
      time: "8:26am",
      text: "Thanks buddy.",
      avatar: null,
      emoji: null,
    },
  ],
  geoff: [
    {
      id: 1,
      user: "Geoff",
      time: "yesterday",
      text: "hope to see you in the cast friend",
      avatar: null,
      emoji: null,
    },
  ],
};

// GET /api/conversations - Get all conversations
router.get("/", async (req, res) => {
  res.json(conversations);
});

// GET /api/conversations/:id - Get conversation details and messages
router.get("/:id", async (req, res) => {
  const conversationId = req.params.id;

  // Find the conversation
  const conversation = conversations.find((conv) => conv.id === conversationId);

  if (!conversation) {
    return res.status(404).json({
      error: "Conversation not found",
      message: `Conversation with id ${conversationId} does not exist`,
    });
  }

  // Get messages for this conversation
  const messages = messagesByConversation[conversationId] || [];

  // Return conversation details with messages
  res.json({
    conversation,
    messages,
  });
});

export default router;
