import React, { useEffect, useRef, useState } from 'react';
import '../styles/StreamChat.css';
import apiClient from '../api/client.js';

function StreamChat({ initialComments = [] }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const chatContainerRef = useRef(null);

  useEffect(() => {
    loadComments();
    apiClient.connectWebSocket();

    const onNewComment = (data) => {
      setComments((prevComments) => [...prevComments, data.comment]);
    };
    const onConnection = (data) => {
      console.log('WebSocket connected:', data.message);
    };
    const onError = (data) => {
      console.error('WebSocket error:', data.message);
    };

    apiClient.onWebSocketMessage('new_comment', onNewComment);
    apiClient.onWebSocketMessage('connection', onConnection);
    apiClient.onWebSocketMessage('error', onError);

    return () => {
      apiClient.offWebSocketMessage('new_comment', onNewComment);
      apiClient.offWebSocketMessage('connection', onConnection);
      apiClient.offWebSocketMessage('error', onError);
    };
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      if (initialComments.length) {
        setComments(initialComments);
      } else {
        const data = await apiClient.getComments();
        setComments(data);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [comments]);

  const handleSendComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const success = apiClient.sendComment('You', newComment.trim());
      if (success) {
        setNewComment('');
      } else {
        const newCommentObj = {
          id: Date.now(),
          user: 'You',
          message: newComment.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setComments((prevComments) => [...prevComments, newCommentObj]);
        setNewComment('');
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
        {loading && <div className="loading-message">Loading comments...</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && comments.length === 0 && (
          <div className="no-comments-message">No comments yet. Be the first to comment!</div>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className={`chat-comment ${comment.user === 'You' ? 'own-comment' : ''}`}>
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


