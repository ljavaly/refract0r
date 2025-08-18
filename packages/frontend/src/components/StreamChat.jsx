import React, { useEffect, useRef, useState } from "react";
import "../styles/StreamChat.css";
import wsClient from "../api/ws.js";

function StreamChat({ initialComments = [] }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    wsClient.connectWebSocket();

    const onNewComment = (data) => {
      setComments((prevComments) => [...prevComments, data.comment]);
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
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [comments]);

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

  return (
    <div className="stream-chat-box">
      <div className="chat-header">
        <h3>Live Chat</h3>
        <span className="viewer-count">👥 127 viewers</span>
      </div>

      <div className="chat-comments" ref={chatContainerRef}>
        {comments.length === 0 && (
          <div className="no-comments-message">
            No comments yet. Be the first to comment!
          </div>
        )}
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`chat-comment ${comment.user === "You" ? "own-comment" : ""}`}
          >
            <div className="comment-header">
              <span className="username">{comment.user}</span>
              <span className="timestamp">{comment.timestamp}</span>
            </div>
            <div className="comment-content">{comment.message}</div>
          </div>
        ))}
      </div>

      <form className="chat-input-form" onSubmit={handleSendComment}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Type a comment..."
          className="chat-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}

export default StreamChat;
