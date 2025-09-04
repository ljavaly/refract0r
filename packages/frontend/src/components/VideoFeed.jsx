import React from "react";
import "../styles/VideoFeed.css";

function VideoFeed() {
  return (
    <div className="video-feed-container">
      <div className="main-layout">
        <main className="video-feed-main-content">
          <div className="content-section">
            <h2 className="section-header">Your Videos</h2>
            <div className="video-grid">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="video-card">
                  <div className="video-thumbnail"></div>
                  <div className="video-info">
                    <div className="video-title">Video Title {index + 1}</div>
                    <div className="video-meta">
                      <span className="channel-name">Channel Name</span>
                      <span className="video-stats">Views • Time</span>
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
