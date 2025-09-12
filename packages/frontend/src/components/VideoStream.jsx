import "../styles/VideoStream.css";
import React, { useEffect, useRef, useState } from "react";
import StreamChat from "./StreamChat.jsx";

function VideoStream() {
  // Ref for the user's video element
  const userVideoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  // Chat moved to StreamChat component

  useEffect(() => {
    const startLocalCamera = async () => {
      if (isCameraOn) {
        // Only try to get media if camera is meant to be on
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { width: 640, height: 480 },
          });

          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
            userVideoRef.current.onloadedmetadata = () => {
              userVideoRef.current.play();
            };
          }
        } catch (err) {
          console.error("Error accessing user media:", err);
          // Handle user denying camera access or other errors
          setIsCameraOn(false); // Turn off the toggle if access fails
        }
      } else {
        // If camera is off, stop any existing stream
        if (userVideoRef.current && userVideoRef.current.srcObject) {
          const stream = userVideoRef.current.srcObject;
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
          userVideoRef.current.srcObject = null; // Clear the video source
        }
      }
    };

    startLocalCamera();

    // Cleanup function: stop the camera stream when the component unmounts
    // or when isCameraOn becomes false
    return () => {
      if (userVideoRef.current && userVideoRef.current.srcObject) {
        const stream = userVideoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]); // Add isCameraOn to the dependency array

  return (
    <>
      <div className="video-container">
        <div className="video-box">
          <video
            id="user-video"
            ref={userVideoRef}
            autoPlay
            muted
            className="video-element"
          ></video>

          {/* Live indicator - only shows when streaming */}
          {isCameraOn && (
            <div className="live-indicator">
              <div className="live-dot"></div>
              <span className="live-text">LIVE</span>
            </div>
          )}

          {/* Stream metadata section */}
          <div className="stream-metadata">
            <div className="stream-info">
              <div className="stream-title-section">
                <h1 className="stream-title">TRENT4YOU - Stream</h1>
              </div>
              <div className="stream-stats">
                <span className="viewer-count">15,151 viewers</span>
                <span className="tip-count">100 tokens</span>
              </div>
            </div>
            <div className="stream-actions">
              <button
                className="follow-button"
                onClick={() => setIsCameraOn((prev) => !prev)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                {isCameraOn ? "Stop" : "Start"}
              </button>
              <button className="mute-button">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" />
                </svg>
                Mute
              </button>
              <button className="share-button">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share
              </button>
              <button className="more-button">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <StreamChat />
      </div>
    </>
  );
}

export default VideoStream;
