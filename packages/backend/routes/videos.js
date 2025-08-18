const express = require("express");
const router = express.Router();

// GET /api/videos - Get all videos
router.get("/", (req, res) => {
  // Mock video data
  const videos = [
    {
      id: 1,
      title: "Sample Video 1",
      description: "This is a sample video description",
      thumbnail: "https://via.placeholder.com/320x180",
      channel: "Sample Channel",
      views: 1000,
      duration: "10:30",
      uploadDate: "2024-01-15",
    },
    {
      id: 2,
      title: "Sample Video 2",
      description: "Another sample video description",
      thumbnail: "https://via.placeholder.com/320x180",
      channel: "Another Channel",
      views: 2500,
      duration: "15:45",
      uploadDate: "2024-01-14",
    },
    {
      id: 3,
      title: "Sample Video 3",
      description: "Yet another sample video description",
      thumbnail: "https://via.placeholder.com/320x180",
      channel: "Third Channel",
      views: 500,
      duration: "8:20",
      uploadDate: "2024-01-13",
    },
  ];

  res.json(videos);
});

// GET /api/videos/:id - Get video by ID
router.get("/:id", (req, res) => {
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

// POST /api/videos - Create new video (placeholder)
router.post("/", (req, res) => {
  const { title, description, channel } = req.body;

  // Mock response for creating a video
  const newVideo = {
    id: Date.now(),
    title: title || "New Video",
    description: description || "New video description",
    channel: channel || "New Channel",
    views: 0,
    uploadDate: new Date().toISOString().split("T")[0],
  };

  res.status(201).json(newVideo);
});

module.exports = router;
