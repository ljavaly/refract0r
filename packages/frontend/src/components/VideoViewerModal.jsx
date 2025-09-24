import React, { useState, useRef, useEffect } from "react";
import "../styles/VideoViewerModal.css";
import AudienceChat from "./AudienceChat.jsx";
import closeIcon from "../assets/close-circle.svg";

function VideoViewerModal({ video, isOpen, onClose }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    // Parse duration from string (e.g., "9:47" to seconds)
    const parseDuration = (durationStr) => {
        if (!durationStr) return 0;
        const parts = durationStr.split(':');
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    };

    // Format time to MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (video && videoRef.current) {
            // Set mock duration based on video data
            const mockDuration = parseDuration(video.duration);
            setDuration(mockDuration);
            setCurrentTime(0);
        }
    }, [video]);

    useEffect(() => {
        // Close modal on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
        // Since we don't have actual video files, we'll simulate playback
        if (!isPlaying) {
            simulatePlayback();
        }
    };

    const simulatePlayback = () => {
        const interval = setInterval(() => {
            setCurrentTime((prev) => {
                if (prev >= duration) {
                    clearInterval(interval);
                    setIsPlaying(false);
                    return duration;
                }
                return prev + 1;
            });
        }, 1000);

        // Store interval ID to clear it when pausing
        if (videoRef.current) {
            videoRef.current.playbackInterval = interval;
        }
    };

    const handleProgressClick = (e) => {
        const progressBar = e.currentTarget;
        const clickX = e.clientX - progressBar.getBoundingClientRect().left;
        const progressWidth = progressBar.offsetWidth;
        const newTime = (clickX / progressWidth) * duration;
        setCurrentTime(newTime);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e) => {
        setVolume(e.target.value / 100);
    };

    if (!isOpen || !video) return null;

    return (
        <div className="video-modal-overlay" onClick={onClose}>
            <div>
                <img className="modal-close-button" src={closeIcon} alt="Close" />
            </div>

            <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="video-modal-content">
                    <div className="video-player-section">
                        <div className="video-player-wrapper">
                            {/* Video placeholder */}
                            <div
                                ref={videoRef}
                                className="video-player"
                                style={{ backgroundImage: `url(${video.thumbnail})` }}
                            >
                                {/* Play/Pause overlay */}
                                <div className="video-controls-overlay" onClick={togglePlay}>
                                    <div className="play-pause-button">
                                        {isPlaying ? (
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                            </svg>
                                        ) : (
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                {/* Video metadata overlay */}
                                <div className="stream-metadata">
                                    <div className="stream-info">
                                        <div className="stream-title-section">
                                            <h1 className="stream-title">{video.title}</h1>
                                        </div>
                                        <div className="stream-stats">
                                            <span className="viewer-count">{video.views} views</span>
                                            <span className="upload-date">{video.uploadDate}</span>
                                        </div>
                                    </div>
                                    <div className="stream-actions">
                                        <button className="share-button">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                <circle cx="18" cy="5" r="3" />
                                                <circle cx="6" cy="12" r="3" />
                                                <circle cx="18" cy="19" r="3" />
                                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2" />
                                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                            Share
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Progress bar and controls */}
                            <div className="video-controls-bar">
                                <div className="progress-section">
                                    <div
                                        className="progress-bar"
                                        onClick={handleProgressClick}
                                    >
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
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        )}
                                    </button>

                                    <button className="control-button" onClick={toggleMute}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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

                    {/* Chat section */}
                    <div className="video-chat-section">
                        <AudienceChat isAdmin={true} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoViewerModal;
