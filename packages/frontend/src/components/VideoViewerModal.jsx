import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from "react";
import "../styles/VideoViewerModal.css";
import AudienceChat from "./AudienceChat.jsx";
import closeIcon from "../assets/close-circle.svg";
import apiClient from "../api/client.js";

// Memoized video player component to prevent re-renders when comments change
const VideoPlayer = memo(
  ({
    video,
    displayVideo,
    videoRef,
    isLoading,
    isPlaying,
    currentTime,
    duration,
    formatTime,
    togglePlay,
    handleProgressClick,
    handleVideoLoadedMetadata,
    handleVideoLoadedData,
    handleVideoTimeUpdate,
    handleVideoEnded,
    handleVideoLoadStart,
    handleVideoCanPlay,
    handleVideoWaiting,
    handleVideoError,
    toggleMute,
    handleVolumeChange,
    isMuted,
    volume,
    shouldInitVideo,
  }) => {
    return (
      <div className="video-player-section">
        <div className="video-player-wrapper">
          {/* Video player */}
          <div className="video-player">
            <video
              key={`video-${video?.id}`}
              ref={videoRef}
              className="video-element"
              poster={displayVideo.thumbnail}
              onLoadedMetadata={handleVideoLoadedMetadata}
              onLoadedData={handleVideoLoadedData}
              onTimeUpdate={handleVideoTimeUpdate}
              onEnded={handleVideoEnded}
              onLoadStart={handleVideoLoadStart}
              onCanPlay={handleVideoCanPlay}
              onWaiting={handleVideoWaiting}
              onError={handleVideoError}
              onPlay={() => {
                console.log("Video play event");
                // setIsPlaying handled in parent
              }}
              onPause={() => {
                console.log("Video pause event");
                // setIsPlaying handled in parent
              }}
              preload="metadata"
              playsInline
              controls={false}
              muted={false}
            />

            {/* Loading indicator */}
            {(isLoading || !shouldInitVideo) && (
              <div className="loading-overlay">
                <div className="loading-spinner">
                  {!shouldInitVideo ? "Loading comments..." : "Loading..."}
                </div>
              </div>
            )}

            {/* Play/Pause overlay */}
            <div className="video-controls-overlay" onClick={togglePlay}>
              <div className="play-pause-button">
                {isPlaying ? (
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Video metadata overlay */}
            <div className="stream-metadata">
              <div className="stream-info">
                <div className="stream-title-section">
                  <h1 className="stream-title">{displayVideo.title}</h1>
                </div>
                <div className="stream-stats">
                  <span className="viewer-count">
                    {displayVideo.views} views
                  </span>
                  <span className="upload-date">{displayVideo.uploadDate}</span>
                </div>
              </div>
              <div className="stream-actions">
                <button className="share-button">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line
                      x1="8.59"
                      y1="13.51"
                      x2="15.42"
                      y2="17.49"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="15.41"
                      y1="6.51"
                      x2="8.59"
                      y2="10.49"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Progress bar and controls */}
          <div className="video-controls-bar">
            <div className="progress-section">
              <div className="progress-bar" onClick={handleProgressClick}>
                <div
                  className="progress-fill"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
              <div className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="control-buttons">
              <button className="control-button" onClick={togglePlay}>
                {isPlaying ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button className="control-button" onClick={toggleMute}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  {isMuted ? (
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  ) : (
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  )}
                </svg>
              </button>

              <div className="volume-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume * 100}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

function VideoViewerModal({ video, isOpen, onClose }) {
  const videoRef = useRef(null);
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [videoViewerComments, setVideoViewerComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [shouldInitVideo, setShouldInitVideo] = useState(false);

  // Format time to MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Use fetched video data if available, otherwise fall back to prop data
  // MUST be defined early to be used in effects below
  const displayVideo = useMemo(() => videoData || video, [videoData, video]);

  // Fetch comments first when modal opens
  useEffect(() => {
    if (isOpen) {
      setCommentsLoaded(false);
      setShouldInitVideo(false);
      setVideoViewerComments([]);

      const loadComments = async () => {
        try {
          const data = await apiClient.getComments();
          setVideoViewerComments(data);
          setCommentsLoaded(true);
        } catch (error) {
          console.error("Failed to fetch comments:", error);
          setVideoViewerComments([]);
          setCommentsLoaded(true); // Still proceed even if comments fail
        }
      };

      loadComments();
    } else {
      setVideoViewerComments([]);
      setCommentsLoaded(false);
      setShouldInitVideo(false);
    }
  }, [isOpen]);

  // After comments are loaded, fetch video data
  useEffect(() => {
    if (isOpen && video?.id && commentsLoaded) {
      setIsLoading(true);
      setVideoData(null);

      apiClient
        .getVideo(video.id)
        .then((data) => {
          setVideoData(data);
          setIsLoading(false);
          // Small delay before initializing video element
          setTimeout(() => setShouldInitVideo(true), 100);
        })
        .catch((error) => {
          console.error("Failed to fetch video data:", error);
          setIsLoading(false);
          setShouldInitVideo(true); // Initialize anyway to show error state
        });
    }
  }, [isOpen, video?.id, commentsLoaded]);

  // Initialize video element when ref becomes available and set poster
  useEffect(() => {
    if (videoRef.current && displayVideo?.thumbnail) {
      const video = videoRef.current;

      // Set default properties
      video.controls = false;
      video.playsInline = true;
      video.preload = "none"; // Don't preload until we're ready
      video.poster = displayVideo.thumbnail; // Ensure poster is set

      return () => {
        if (video) {
          video.pause();
          video.src = "";
          video.load();
        }
      };
    }
  }, [displayVideo?.thumbnail]);

  // Update video source when video data changes and video should be initialized
  useEffect(() => {
    console.log("Video data effect triggered:", {
      videoData: !!videoData,
      hasVideoRef: !!videoRef.current,
      videoUrl: videoData?.videoUrl,
      shouldInitVideo,
    });

    if (!videoData?.videoUrl || !videoRef.current || !shouldInitVideo) {
      console.log(
        "Missing video data, ref, or not ready to init video, skipping video setup",
      );
      return;
    }

    const video = videoRef.current;
    console.log("Setting up video with URL:", videoData.videoUrl);

    // Reset states
    setCurrentTime(0);
    setIsPlaying(false);
    setIsLoading(true);

    // Set video source and properties
    video.src = videoData.videoUrl;
    video.preload = "metadata";
    video.muted = false; // Ensure not muted by default
    video.volume = volume;

    // Force load
    video.load();
  }, [videoData?.videoUrl, volume, shouldInitVideo]);

  // Video event handlers - wrapped in useCallback to prevent re-renders
  const handleVideoLoadedMetadata = useCallback(() => {
    console.log("Video metadata loaded, duration:", videoRef.current?.duration);
    if (videoRef.current && videoRef.current.duration) {
      setDuration(videoRef.current.duration);
      setIsLoading(false); // Metadata loaded, can hide loading
    }
  }, []);

  const handleVideoTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, []);

  const handleVideoLoadStart = useCallback(() => {
    console.log("Video load start");
    setIsLoading(true);
  }, []);

  const handleVideoCanPlay = useCallback(() => {
    console.log("Video can play - ready state:", videoRef.current?.readyState);
    setIsLoading(false);
  }, []);

  const handleVideoLoadedData = useCallback(() => {
    console.log("Video data loaded - can start playing");
    setIsLoading(false);
  }, []);

  const handleVideoWaiting = useCallback(() => {
    console.log("Video waiting for data");
    setIsLoading(true);
  }, []);

  const handleVideoError = useCallback((e) => {
    console.error("Video element error:", e.target.error);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Close modal on Escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const togglePlay = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        await videoRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Video playback error:", error);
    }
  }, [isPlaying]);

  const handleProgressClick = useCallback(
    (e) => {
      if (!videoRef.current) return;

      const progressBar = e.currentTarget;
      const clickX = e.clientX - progressBar.getBoundingClientRect().left;
      const progressWidth = progressBar.offsetWidth;
      const newTime = (clickX / progressWidth) * duration;

      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [duration],
  );

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  }, []);

  const handleVolumeChange = useCallback((e) => {
    if (!videoRef.current) return;

    const newVolume = e.target.value / 100;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);

    // Unmute if volume is changed from 0
    if (newVolume > 0 && videoRef.current.muted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  }, []);

  if (!isOpen || !video) return null;

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div>
        <img
          className="modal-close-button"
          onClick={onClose}
          src={closeIcon}
          alt="Close"
        />
      </div>

      <div
        className="video-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="video-modal-content">
          <VideoPlayer
            video={video}
            displayVideo={displayVideo}
            videoRef={videoRef}
            isLoading={isLoading}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            formatTime={formatTime}
            togglePlay={togglePlay}
            handleProgressClick={handleProgressClick}
            handleVideoLoadedMetadata={handleVideoLoadedMetadata}
            handleVideoLoadedData={handleVideoLoadedData}
            handleVideoTimeUpdate={handleVideoTimeUpdate}
            handleVideoEnded={handleVideoEnded}
            handleVideoLoadStart={handleVideoLoadStart}
            handleVideoCanPlay={handleVideoCanPlay}
            handleVideoWaiting={handleVideoWaiting}
            handleVideoError={handleVideoError}
            toggleMute={toggleMute}
            handleVolumeChange={handleVolumeChange}
            isMuted={isMuted}
            volume={volume}
            shouldInitVideo={shouldInitVideo}
          />

          {/* Chat section */}
          <div className="video-chat-section">
            <AudienceChat
              initialComments={videoViewerComments}
              key="audience-chat"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoViewerModal;
