import React, { useEffect, useRef, useState } from "react";
import "../styles/AudienceChat.css";
import wsClient from "../api/ws.js";

function AudienceChat({ initialComments = null, isAdmin = false }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatContainerRef = useRef(null);
  const prevCommentsLength = useRef(0);

  const ENLARGED_EMOJIS_MAPPING = {
    "🎁": 2,
    "💰": 2,
    "💎": 2,
    "🌹": 4,
  };

  // Function to process message and enlarge specific emojis
  const processMessageWithEnlargedEmojis = (message) => {
    // Ensure message is a string, return empty string if not
    if (typeof message !== 'string') {
      return '';
    }
    
    let processedMessage = message;
    
    // Replace each emoji in the mapping with a wrapped version
    Object.entries(ENLARGED_EMOJIS_MAPPING).forEach(([emoji, scale]) => {
      const regex = new RegExp(emoji, 'g');
      processedMessage = processedMessage.replace(
        regex,
        `<span class="enlarged-emoji emoji-${scale}x">${emoji}</span>`
      );
    });
    
    return processedMessage;
  };

  useEffect(() => {
    // Connect to the WebSocket and define listeners
    wsClient.connectWebSocket();

    const onNewComment = (data) => {
      if (!isAdmin) {
        setComments((prevComments) => [...prevComments, data.comment]);
      }
    };
    const onConnection = (data) => {
      console.log("WebSocket connected:", data.message);
    };
    const onError = (data) => {
      console.error("WebSocket error:", data.message);
    };

    wsClient.onWebSocketMessage("new_comment", onNewComment);
    wsClient.onWebSocketMessage("connection", onConnection);
    wsClient.onWebSocketMessage("error", onError);

    return () => {
      wsClient.offWebSocketMessage("new_comment", onNewComment);
      wsClient.offWebSocketMessage("connection", onConnection);
      wsClient.offWebSocketMessage("error", onError);
    };
  }, []);

  useEffect(() => {
    // If we got initial comments, display them
    if (initialComments && initialComments.length > 0) {
      setComments(initialComments);
    } else if (initialComments && initialComments.length === 0) {
      console.log("No initial comments, setting comments to empty array...");
      setComments([]);
    }
  }, [initialComments]);

  useEffect(() => {
    if (isAdmin) {
      return;
    }

    // Only scroll to bottom if comments were added (length increased) or it's the initial load
    if (
      chatContainerRef.current &&
      (comments.length > prevCommentsLength.current ||
        prevCommentsLength.current === 0)
    ) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    prevCommentsLength.current = comments.length;
  }, [comments, isAdmin]);

  const handleSendComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const success = wsClient.sendComment("You", newComment.trim());
      if (success) {
        setNewComment("");
      } else {
        const newCommentObj = {
          id: Date.now(),
          user: "You",
          message: newComment.trim(),
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setComments((prevComments) => [...prevComments, newCommentObj]);
        setNewComment("");
      }
    }
  };

  const handleEmojiClick = (emoji) => {
    setNewComment((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const emojis = [
    "😀",
    "😂",
    "😍",
    "😭",
    "😊",
    "😎",
    "🤔",
    "😴",
    "🔥",
    "❤️",
    "👍",
    "👎",
    "🎉",
    "😱",
    "🤯",
    "💯",
  ];

  return (
    <div className="stream-chat-box">
      <div className="chat-comments" ref={chatContainerRef}>
        {comments.length === 0 && (
          <div className="no-comments-message">
            No comments yet. Be the first to comment!
          </div>
        )}
        {comments.map((comment, index) => (
          <div
            key={comment.id}
            className={`chat-comment ${isAdmin && index === 0 ? "highlight-next" : ""}`}
          >
            <div className="comment-header">
              <span className="username">{comment.user}</span>
              <span className="timestamp">{comment.timestamp}</span>
            </div>
            <div 
              className="comment-content"
              dangerouslySetInnerHTML={{ 
                __html: processMessageWithEnlargedEmojis(comment.message) 
              }}
            />
          </div>
        ))}
      </div>

      {!isAdmin && (
        <form className="chat-input-form" onSubmit={handleSendComment}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type a comment..."
            className="chat-input"
          />
          <div className="emoji-picker-container">
            <button
              type="button"
              className="emoji-button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 9 1.5 1.5L12 9l1.5 1.5L15 9" />
                <path d="M8 15s1.5 2 4 2 4-2 4-2" />
              </svg>
            </button>
            {showEmojiPicker && (
              <div className="emoji-picker">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    className="emoji-option"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="send-button">
            Send
          </button>
        </form>
      )}
    </div>
  );
}

export default AudienceChat;
