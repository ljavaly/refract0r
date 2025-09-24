import express from "express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { getThumbnails } from "../utils/gcp.js";

// ES module way to import JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to load fresh data each time (prevents caching)
const getVideoData = () => {
  return JSON.parse(
    readFileSync(join(__dirname, "../static/video_thumbnails.json"), "utf-8")
  );
};

const router = express.Router();

// GET /api/videos - Get all videos
router.get("/", async (req, res) => {
  let thumbnails = await getThumbnails()
    .then((result) => {
      return result.thumbnailUrls;
    })
    .catch((error) => {
      console.error("Error fetching thumbnails:", error);
      return [];
    });

  const videoData = getVideoData();
  const videos = videoData.map((video, index) => ({
    id: index + 1,
    title: video.title,
    thumbnail: thumbnails[index] || thumbnails[0],
    views: video.views,
    duration: video.duration,
    uploadDate: video.date,
  }));

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
