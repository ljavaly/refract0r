import express from "express";
const router = express.Router();

// Mock comments for video stream page
const comments = [
  {
    id: 1,
    user: "TechGuru42",
    message: "Great stream! Love the content",
    timestamp: "2:30 PM",
  },
  {
    id: 2,
    user: "StreamFan99",
    message: "How long have you been streaming?",
    timestamp: "2:32 PM",
  },
  {
    id: 3,
    user: "Viewer123",
    message: "Can you show u,ls that trick again?",
    timestamp: "2:35 PM",
  },
  { id: 4, user: "ChatMaster", message: "🔥🔥🔥", timestamp: "2:36 PM" },
  {
    id: 5,
    user: "NewViewer",
    message: "First time here, loving the vibe!",
    timestamp: "2:38 PM",
  },
  {
    id: 6,
    user: "RegularFan",
    message: "Missed yesterday's stream, glad I caught this one",
    timestamp: "2:40 PM",
  },
  {
    id: 7,
    user: "TechGuru42",
    message: "Thanks everyone for tuning in!",
    timestamp: "2:42 PM",
  },
  {
    id: 8,
    user: "StreamFan99",
    message: "What's next on the agenda?",
    timestamp: "2:43 PM",
  },
];

// GET /api/comments - Get all comments
router.get("/", async (req, res) => {
  res.json(comments);
});

export default router;
