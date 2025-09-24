import express from "express";
import { getThumbnails } from "../utils/gcp.js";

const router = express.Router();

// GET /api/videos - Get all videos
router.get("/", async (req, res) => {
  let videos = await getThumbnails()
    .then((result) => {
      const videos = result.thumbnailUrls.map((thumbnailUrl, index) => ({
        id: index + 1,
        title: `Video ${index + 1}`,
        description: `Description for video ${index + 1}`,
        thumbnail: thumbnailUrl,
        channel: `Channel ${index + 1}`,
        views: Math.floor(Math.random() * 10000) + 100,
        duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(
          Math.random() * 60,
        )
          .toString()
          .padStart(2, "0")}`,
        uploadDate: new Date(
          Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split("T")[0],
      }));
      return videos;
    })
    .catch((error) => {
      console.error("Error fetching thumbnails:", error);
      return [];
    });

  res.json(videos);
});

// GET /api/videos/:id - Get video by ID
router.get("/:id", async (req, res) => {
  const videoId = req.params.id;

  // Mock single video data
  const video = {
    id: videoId,
    title: `Video ${videoId}`,
    description: `Description for video ${videoId}`,
    thumbnail: "https://via.placeholder.com/320x180",
    channel: "Sample Channel",
    views: 1000,
    duration: "10:30",
    uploadDate: "2024-01-15",
    likes: 150,
    dislikes: 5,
  };

  res.json(video);
});

export default router;
