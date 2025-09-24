import express from "express";
import { loadFile } from "../utils/static.js";
import { getThumbnails } from "../utils/gcp.js";

// Function to load fresh data each time (prevents caching)
const getVideos = async () => {
  return await loadFile("videos.json");
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

  const videos = await getVideos();
  const videoData = videos.map((video, index) => ({
    id: index + 1,
    title: video.title,
    thumbnail: thumbnails[index] || thumbnails[0],
    views: video.views,
    duration: video.duration,
    uploadDate: video.date,
  }));

  res.json(videoData);
});

// GET /api/videos/:id - Get video by ID
router.get("/:id", async (req, res) => {
  const videoId = parseInt(req.params.id);

  let thumbnails = await getThumbnails()
    .then((result) => {
      return result.thumbnailUrls;
    })
    .catch((error) => {
      console.error("Error fetching thumbnails:", error);
      return [];
    });

  const videos = await getVideos();
  const video = videos.find((video) => video.id === videoId);

  if (!video) {
    return res.status(404).json({ error: "Video not found" });
  }

  const videoData = {
    id: videoId,
    title: video.title,
    thumbnail: thumbnails[videoId - 1] || thumbnails[0],
    views: video.views,
    duration: video.duration,
    uploadDate: video.date,
    videoUrl: "https://storage.googleapis.com/refract0r-assets/IMG_9906.mov",
  };

  res.json(videoData);
});

export default router;
