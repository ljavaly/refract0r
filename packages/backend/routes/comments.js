import express from "express";
import { loadJsonFile, readFiles } from "../utils/static.js";

const router = express.Router();

// GET /api/comments - Get video viewer modal comments
router.get("/", async (req, res) => {
  const comments = await loadJsonFile("videoViewerComments.json");
  const commentsData = formatComments(comments);
  res.json(commentsData);
});

// GET /api/comments/:id - Get audience comments by scene ID
router.get("/:id", async (req, res) => {
  const sceneFile = (await readFiles("audience")).find((file) =>
    file.startsWith(req.params.id),
  );

  if (!sceneFile) {
    return res.status(404).json({
      error: "Scene not found",
      message: `Scene with id ${req.params.id} does not exist`,
    });
  }

  const comments = await loadJsonFile(`audience/${sceneFile}`);
  const commentsData = formatComments(comments);
  res.json(commentsData);
});

export const formatComments = (comments) => {
  return comments.map((comment, index) => ({
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
};

export default router;
