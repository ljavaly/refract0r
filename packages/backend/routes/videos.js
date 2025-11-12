import express from "express";
import { loadJsonFile } from "../utils/static.js";
import { getThumbnails } from "../utils/gcp.js";

// Function to load fresh data each time (prevents caching)
const getVideoMetadata = async () => {
  return await loadJsonFile("browse/metadata.json");
};

const router = express.Router();

// GET /api/videos - Get all videos
router.get("/", async (req, res) => {
  const thumbnails = await getThumbnails()
    .then((result) => {
      // console.log("Retrieved", result.count, "thumbnails:", result.thumbnails);
      return result.thumbnails;
    })
    .catch((error) => {
      console.error("Error fetching thumbnails:", error);
      return [];
    });

  const metadata = await getVideoMetadata();
  const videos = thumbnails
    .map((thumbnail) => {
      const video = metadata.find((video) => thumbnail.id === video.id);
      if (!video) {
        return null;
      }
      return {
        id: video.id,
        title: video.title,
        thumbnail: thumbnail?.url,
        views: video.views,
        duration: video.duration,
        uploadDate: video.date,
      };
    })
    .filter((video) => !!video);

  res.json(videos);
});

// GET /api/videos/:id - Get video by ID
router.get("/:id", async (req, res) => {
  const videoId = parseInt(req.params.id);

  const thumbnail = await getThumbnails()
    .then((result) => {
      return result.thumbnails.find((thumbnail) => thumbnail.id === videoId);
    })
    .catch((error) => {
      console.error("Error fetching thumbnail:", error);
      return null;
    });

  const videos = await getVideoMetadata();
  const video = videos.find((video) => video.id === videoId);

  if (!video) {
    return res.status(404).json({ error: "Video not found" });
  }

  const videoData = {
    id: videoId,
    title: video.title,
    thumbnail: thumbnail?.url,
    views: video.views,
    duration: video.duration,
    uploadDate: video.date,
    videoUrl:
      "https://storage.googleapis.com/refract0r-assets/DANCE00558018.mov",
  };

  res.json(videoData);
});

export default router;
