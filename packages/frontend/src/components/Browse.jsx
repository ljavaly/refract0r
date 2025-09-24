import "../styles/Browse.css";
import apiClient from "../api/client.js";
import VideoViewerModal from "./VideoViewerModal.jsx";

import React, { useState, useEffect } from "react";

function Browse() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    apiClient.getVideos().then((data) => setVideos(data));
  }, []);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div className="video-feed-container">
      <div className="main-layout">
        <main className="video-feed-main-content">
          <div className="content-section">
            <h2 className="section-header">Your Videos</h2>
            <div className="video-grid">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className="video-card"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="video-thumbnail">
                    <img src={video.thumbnail} alt={video.title} />
                    <div className="video-play-overlay">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="video-info">
                    <div className="video-title">{video.title}</div>
                    <div className="video-meta">
                      <span className="video-stats">
                        {video.views} views • {video.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Video Viewer Modal */}
      <VideoViewerModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

export default Browse;
