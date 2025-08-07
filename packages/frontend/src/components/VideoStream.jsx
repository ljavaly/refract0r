import '../styles/VideoStream.css';
import { CommentSchema } from '../../../shared/types.js';
import apiClient from '../api/client.js';

import React, { useEffect, useRef, useState } from 'react';

function VideoStream() {
    // Ref for the user's video element
    const userVideoRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const chatContainerRef = useRef(null);

    useEffect(() => {
        const startLocalCamera = async () => {
            if (isCameraOn) { // Only try to get media if camera is meant to be on
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
                    tracks.forEach(track => track.stop());
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
                tracks.forEach(track => track.stop());
            }
        };
    }, [isCameraOn]); // Add isCameraOn to the dependency array

    // Load comments and setup WebSocket on component mount
    useEffect(() => {
        loadComments();
        setupWebSocket();
        
        // Cleanup WebSocket on unmount
        return () => {
            apiClient.disconnectWebSocket();
        };
    }, []);

    const loadComments = async () => {
        try {
            setLoading(true);
            const data = await apiClient.getComments();
            setComments(data);
        } catch (err) {
            console.error('Failed to load comments:', err);
            setError('Failed to load comments');
        } finally {
            setLoading(false);
        }
    };

    const setupWebSocket = () => {
        // Connect to WebSocket
        apiClient.connectWebSocket();
        
        // Listen for new comments
        apiClient.onWebSocketMessage('new_comment', (data) => {
            setComments(prevComments => [...prevComments, data.comment]);
        });
        
        // Listen for connection status
        apiClient.onWebSocketMessage('connection', (data) => {
            console.log('WebSocket connected:', data.message);
        });
        
        // Listen for errors
        apiClient.onWebSocketMessage('error', (data) => {
            console.error('WebSocket error:', data.message);
        });
    };

    // Auto-scroll to bottom of chat when new comments arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [comments]);

    const handleSendComment = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            // Send comment through WebSocket
            const success = apiClient.sendComment('You', newComment.trim());
            
            if (success) {
                // Clear input field
                setNewComment('');
            } else {
                // Fallback: add comment locally if WebSocket fails
                const newCommentObj = {
                    id: Date.now(),
                    user: 'You',
                    message: newComment.trim(),
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setComments(prevComments => [...prevComments, newCommentObj]);
                setNewComment('');
            }
        }
    };

    return (
        <>
            <div className="video-container grid grid-cols-5">
                <div className="video-box col-span-4">
                    <video id="user-video" ref={userVideoRef} autoPlay muted className="video-element"></video>
                    {/* Button to toggle camera */}
                    <button
                        onClick={() => setIsCameraOn(prev => !prev)}
                        className="camera-toggle-button"
                    >
                        {isCameraOn ? 'Stop Stream' : 'Start Stream'}
                    </button>
                </div>
                <div className="stream-chat-box col-span-1">
                    <div className="chat-header">
                        <h3>Live Chat</h3>
                        <span className="viewer-count">👥 127 viewers</span>
                    </div>
                    
                    <div className="chat-comments" ref={chatContainerRef}>
                        {loading && (
                            <div className="loading-message">
                                Loading comments...
                            </div>
                        )}
                        
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        
                        {!loading && !error && comments.length === 0 && (
                            <div className="no-comments-message">
                                No comments yet. Be the first to comment!
                            </div>
                        )}
                        
                        {comments.map((comment) => (
                            <div key={comment.id} className={`chat-comment ${comment.user === 'You' ? 'own-comment' : ''}`}>
                                <div className="comment-header">
                                    <span className="username">{comment.user}</span>
                                    <span className="timestamp">{comment.timestamp}</span>
                                </div>
                                <div className="comment-content">
                                    {comment.message}
                                </div>
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
            </div>
        </>
    );
}

export default VideoStream;
