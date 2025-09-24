import express from "express";
import { loadFile } from "../utils/static.js";

const router = express.Router();

// GET /api/comments - Get all comments
router.get("/", async (req, res) => {
  const comments = await loadFile("videoViewerComments.json");

  const commentsData = comments.map((comment, index) => ({
    id: index + 1,
    user: comment.user,
    message: comment.message,
    timestamp:
      comment.timestamp ||
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
  }));

  res.json(commentsData);
});

export default router;
