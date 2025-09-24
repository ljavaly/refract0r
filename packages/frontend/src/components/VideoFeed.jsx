import "../styles/VideoFeed.css";
import apiClient from "../api/client.js";

import React, { useState, useEffect } from "react";

function VideoFeed() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    apiClient.getVideos().then((data) => setVideos(data));
  }, []);

  return (
    <div className="video-feed-container">
      <div className="main-layout">
        <main className="video-feed-main-content">
          <div className="content-section">
            <h2 className="section-header">Your Videos</h2>
            <div className="video-grid">
              {videos.map((video, index) => (
                <div key={index} className="video-card">
                  <div className="video-thumbnail">
                    <img src={video.thumbnail} alt={video.title} />
                  </div>
                  <div className="video-info">
                    <div className="video-title">{video.title}</div>
                    <div className="video-meta">
                      <span className="channel-name">{video.channel}</span>
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
    </div>
  );
}

export default VideoFeed;
