import "../styles/TopNav.css";
import mailIcon from "../assets/mail-icon.svg";
import gearIcon from "../assets/gear-icon.svg";
import wsClient from "../api/ws";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import newMessageSound from "../assets/new_message.wav";

function TopNav() {
  const navigate = useNavigate();
  const [hasUnreadMessage, setHasUnreadMessage] = useState(false);
  const audioRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio(newMessageSound);
    audioRef.current.preload = "auto";

    // Clean up audio element on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset to beginning
      audioRef.current.play().catch((error) => {
        console.warn("Could not play notification sound:", error);
      });
    }
  };

  useEffect(() => {
    wsClient.connectWebSocket();

    const onUnreadMessage = (data) => {
      setHasUnreadMessage(true);

      // Only play sound if the message is from a different session
      if (data.sessionId && data.sessionId !== wsClient.sessionId) {
        playNotificationSound();
      }
    };
    const onClearUnreadMessage = (data) => {
      setHasUnreadMessage(false);
    };
    const onConnection = (data) => {
      console.log("WebSocket connected:", data.message);
    };
    const onError = (data) => {
      console.error("WebSocket error:", data.message);
    };

    wsClient.onWebSocketMessage("unreadMessage", onUnreadMessage);
    wsClient.onWebSocketMessage("clearUnreadMessage", onClearUnreadMessage);
    wsClient.onWebSocketMessage("connection", onConnection);
    wsClient.onWebSocketMessage("error", onError);

    return () => {
      wsClient.offWebSocketMessage("unreadMessage", onUnreadMessage);
      wsClient.offWebSocketMessage("clearUnreadMessage", onClearUnreadMessage);
      wsClient.offWebSocketMessage("connection", onConnection);
      wsClient.offWebSocketMessage("error", onError);
    };
  }, []);

  return (
    <>
      <header className="header-main">
        <div className="logo-icon flex">
          <svg
            width="120"
            height="150"
            viewBox="0 -10 120 160"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="title desc"
            preserveAspectRatio="xMidYMin meet"
          >
            <title id="title">
              Monocle with Chain's Right Edge Aligned to Rim
            </title>
            <desc id="desc">
              Monocle rim with the eye near center, and chain's right edge
              aligned with the rim's outermost pixel.
            </desc>
            <rect x="0" y="-10" width="120" height="160" fill="none" />
            <circle
              cx="60"
              cy="30"
              r="30"
              stroke="var(--color-highlight)"
              strokeWidth="14"
              fill="none"
            />
            <circle cx="57" cy="30" r="14" fill="var(--color-highlight)" />
            <line
              x1="91"
              y1="30"
              x2="91"
              y2="110"
              stroke="var(--color-highlight)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <circle cx="91" cy="110" r="8" fill="var(--color-highlight)" />{" "}
          </svg>
        </div>
        <div className="search-section flex-grow">
          <div className="search-input-container">
            <input
              id="search"
              type="text"
              placeholder="Search"
              className="search-input"
            />
            <svg
              className="search-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="nav-link-container grid grid-cols-3">
          <div className="nav-link col-span-1">
            <div className="inbox-icon-container">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/inbox");
                }}
              >
                <img src={mailIcon} alt="Mail" className="nav-icon" />
              </a>
              {hasUnreadMessage && (
                <>
                  <div className="unread-dot"></div>
                  <div className="unread-message-bubble">
                    You have a new message
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="nav-link inbox-icon col-span-1">
            <a href="#">
              <img src={gearIcon} alt="Settings" className="nav-icon" />
            </a>
          </div>
          <div className="nav-link profile-avatar col-span-1">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/admin");
              }}
            >
              TR
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

export default TopNav;
