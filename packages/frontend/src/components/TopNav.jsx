import "../styles/TopNav.css";
import avatar from "../assets/avatar.jpg";
import mailIcon from "../assets/mail-icon.svg";
import gearIcon from "../assets/gear-icon.svg";
import monocleIcon from "../assets/monocle.svg";
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
          <img src={monocleIcon} />
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
              <img
                src={avatar}
                className="w-full h-full rounded-full object-cover"
              />
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

export default TopNav;
