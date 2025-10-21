import "../styles/Inbox.css";
import apiClient from "../api/client.js";
import wsClient from "../api/ws";

import React, { useState, useEffect } from "react";

function Inbox() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [localMessages, setLocalMessages] = useState({}); // Store locally sent messages by conversation ID

  // On component mount, load conversations and clear unread message
  useEffect(() => {
    loadConversations();
    wsClient.connectWebSocket();
    
    // Wait for WebSocket to be ready before sending clearUnreadMessage
    wsClient.whenReady(() => {
      wsClient.clearUnreadMessage();
    }).catch(error => {
      console.warn('Failed to clear unread message:', error);
    });
  }, []);

  // Load conversation details when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      loadConversationDetails(activeConversation);
    }
  }, [activeConversation]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getConversations();
      setConversations(data);

      // Set default active conversation if none is selected
      if (data.length > 0 && !activeConversation) {
        setActiveConversation(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
      setError("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const loadConversationDetails = async (conversationId) => {
    try {
      setLoading(true);
      const data = await apiClient.getConversation(conversationId);
      const loadedMessages = data.messages || [];
      
      // Merge loaded messages with any local messages for this conversation
      const conversationLocalMessages = localMessages[conversationId] || [];
      const allMessages = [...loadedMessages, ...conversationLocalMessages];
      
      setMessages(allMessages);
      setUsers(data.users || {});
    } catch (err) {
      console.error("Failed to load conversation details:", err);
      setError("Failed to load conversation details");
    } finally {
      setLoading(false);
    }
  };

  const adjustMessageInputHeight = (e) => {
    // Reset height to measure content
    const savedHeight = e.target.style.height;
    e.target.style.height = "auto";

    // Get the natural height needed for content
    const scrollHeight = e.target.scrollHeight;
    const minHeight = 40; // 2.5rem converted to pixels

    // Only grow if content needs more space than minimum
    if (scrollHeight > minHeight) {
      e.target.style.height = Math.min(scrollHeight, 120) + "px";
    } else {
      e.target.style.height = minHeight + "px";
    }
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleConversationClick = (conversationId) => {
    // Set the active conversation
    setActiveConversation(conversationId);
    
    // Clear the unread indicator locally (only in UI, not in underlying data)
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === conversationId ? { ...conv, new: false } : conv
      )
    );
  };

  const handleBlock = () => {
    if (activeConversation) {
      const conversation = conversations.find(
        (c) => c.id === activeConversation,
      );
      if (conversation) {
        console.log(`Blocking conversation with ${conversation.name}`);
        const confirmed = window.confirm(
          `Are you sure you want to block ${conversation.name}?`,
        );
        if (confirmed) {
          // Remove blocked conversation from list by filtering out the conversation with matching name
          setConversations((prevConversations) =>
            prevConversations.filter((c) => c.name !== conversation.name),
          );

          // Clear active conversation if it was the blocked one
          if (activeConversation === conversation.id) {
            setActiveConversation(null);
            setMessages([]);
          }
        }
      }
    }
    setShowDropdown(false);
  };

  // Handle photo selection
  const handlePhotoSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedPhoto({
          file: file,
          preview: e.target.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected photo
  const removeSelectedPhoto = () => {
    setSelectedPhoto(null);
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio({
          blob: audioBlob,
          url: audioUrl,
          duration: Date.now() - window.recordingStartTime
        });
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      setIsRecording(true);
      recorder.start();
      window.recordingStartTime = Date.now();
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  // Remove recorded audio
  const removeRecordedAudio = () => {
    if (recordedAudio?.url) {
      URL.revokeObjectURL(recordedAudio.url);
    }
    setRecordedAudio(null);
  };

  // Send message (text, photo, or voice memo)
  const sendMessage = () => {
    if (!activeConversation) return;

    const hasContent = messageText.trim() || selectedPhoto || recordedAudio;
    if (!hasContent) return;

    // Create message object
    const message = {
      id: Date.now().toString(),
      user: 'Trent4you',  // hardcoded protagonist's username
      timestamp: new Date().toISOString(),
      type: 'message'
    };

    if (messageText.trim()) {
      message.text = messageText.trim();
    }

    if (selectedPhoto) {
      message.photo = {
        name: selectedPhoto.name,
        url: selectedPhoto.preview, // In a real app, you'd upload this to a server
        type: 'image'
      };
    }

    if (recordedAudio) {
      // Create a new blob URL that won't be revoked for the message
      const messageAudioUrl = URL.createObjectURL(recordedAudio.blob);
      message.audio = {
        url: messageAudioUrl, // In a real app, you'd upload this to a server
        duration: Math.round((recordedAudio.duration || 0) / 1000),
        type: 'audio',
        blob: recordedAudio.blob // Keep reference to blob for potential cleanup later
      };
    }

    // Add message to local messages store for this conversation
    setLocalMessages(prev => ({
      ...prev,
      [activeConversation]: [...(prev[activeConversation] || []), message]
    }));
    
    // Also add to current messages display
    setMessages(prev => [...prev, message]);

    // Clear inputs
    setMessageText("");
    removeSelectedPhoto();
    removeRecordedAudio();

    // Reset textarea height
    const textarea = document.querySelector('.message-input');
    if (textarea) {
      textarea.style.height = 'auto';
    }
  };

  // Handle Enter key to send message
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".dropdown-menu-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Cleanup audio URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any audio URLs in messages to prevent memory leaks
      messages.forEach(message => {
        if (message.audio && message.audio.url) {
          URL.revokeObjectURL(message.audio.url);
        }
      });
      
      // Clean up audio URLs in local messages
      Object.values(localMessages).flat().forEach(message => {
        if (message.audio && message.audio.url) {
          URL.revokeObjectURL(message.audio.url);
        }
      });
      
      // Clean up current recorded audio if any
      if (recordedAudio?.url) {
        URL.revokeObjectURL(recordedAudio.url);
      }
    };
  }, []); // Empty dependency array means this runs only on unmount

  // Show loading state
  if (loading && conversations.length === 0) {
    return (
      <div className="inbox-container">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading conversations...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="inbox-container">
        <div className="flex items-center justify-center h-full">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="inbox-container">
        {/* Sidebar */}
        <div className="inbox-sidebar">
          <div>
            <button className="tab-button">New Message</button>
          </div>
          <div className="tabs-container">
            <button
              className={`tab-button ${activeTab === "inbox" ? "active" : ""}`}
              onClick={() => setActiveTab("inbox")}
            >
              Inbox ({conversations.filter((c) => c.new).length})
            </button>
            <button
              className={`tab-button ${activeTab === "other" ? "active" : ""}`}
              onClick={() => setActiveTab("other")}
            >
              Requests (15)
            </button>
          </div>

          <div className="conversation-list">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`conversation-item ${activeConversation === conv.id ? "active" : ""}`}
                onClick={() => handleConversationClick(conv.id)}
              >
                {conv.new && (
                  <div className="conversation-unread-indicator">
                    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <circle fill="currentColor" />
                    </svg>
                  </div>
                )}
                <div className="conversation-avatar">
                  {conv.avatar ? (
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    conv.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="conversation-details">
                  <div className="conversation-name">{conv.name}</div>
                  <div className="conversation-last-message">
                    {conv.lastMessage}
                  </div>
                </div>
                <div className="conversation-time">
                  {conv.time}
                  {conv.status && (
                    <div
                      className={`w-2 h-2 rounded-full mt-1 ${
                        conv.status === "online"
                          ? "bg-green-500"
                          : conv.status === "away"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                      }`}
                    ></div>
                  )}
                </div>
                <div className="conversation-actions">
                  <svg
                    className="conversation-action-icon"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          <div className="main-content-header">
            <div className="header-title-container">
              <span className="main-content-title">
                {(activeConversation &&
                  conversations.find((c) => c.id === activeConversation)
                    ?.name) ||
                  "Select a conversation"}
              </span>
              <div className="dropdown-menu-container">
                <button
                  className="dropdown-toggle-button"
                  onClick={handleDropdownToggle}
                  title="More options"
                >
                  ⋮
                </button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={handleBlock}>
                      Block
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={handleBlock}
                      style={{ color: "red" }}
                    >
                      Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((message) =>
              message.type === "date" ? (
                <div key={message.id} className="date-separator">
                  {message.date}
                </div>
              ) : (
                <div key={message.id} className="message-item">
                  {(() => {
                    const user = users[message.user];
                    const avatar =
                      message.avatar || (user ? user.avatar : null);

                    return (
                      <>
                        {avatar ? (
                          <img
                            src={avatar}
                            alt={`${message.user} Avatar`}
                            className="message-avatar-small"
                          />
                        ) : (
                          <div
                            className="message-avatar-small"
                            style={{
                              backgroundColor: "#4b4b50",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.7rem",
                            }}
                          >
                            {message.user.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="message-content-wrapper">
                          <div className="message-header">
                            <span className="message-username">
                              {user ? user.username : message.user}
                            </span>
                            <span className="message-time">{message.time}</span>
                          </div>
                          <div className="message-content">
                            {message.text && (
                              <div className="message-text">
                                {message.text}{" "}
                                {message.emoji && (
                                  <span className="emoji">{message.emoji}</span>
                                )}
                              </div>
                            )}
                            {message.photo && (
                              <div className="message-photo">
                                <img 
                                  src={message.photo.url} 
                                  alt={message.photo.name}
                                  className="message-photo-img"
                                  style={{
                                    maxWidth: '300px',
                                    maxHeight: '200px',
                                    borderRadius: '8px',
                                    marginTop: message.text ? '8px' : '0'
                                  }}
                                />
                              </div>
                            )}
                            {message.audio && (
                              <div className="message-audio" style={{ marginTop: message.text ? '8px' : '0' }}>
                                <div className="audio-player" style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '8px 12px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  borderRadius: '20px',
                                  maxWidth: '250px'
                                }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/>
                                  </svg>
                                  <audio 
                                    controls 
                                    src={message.audio.url}
                                    style={{ height: '30px', flex: 1 }}
                                  />
                                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                                    {message.audio.duration}s
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ),
            )}
          </div>

          <div className="message-input-area">
            {/* Photo Preview */}
            {selectedPhoto && (
              <div className="attachment-preview" style={{
                padding: '12px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <img 
                  src={selectedPhoto.preview} 
                  alt="Selected photo"
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                    {selectedPhoto.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                    Photo ready to send
                  </div>
                </div>
                <button 
                  onClick={removeSelectedPhoto}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'currentColor',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px'
                  }}
                  title="Remove photo"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Voice Recording Preview */}
            {recordedAudio && (
              <div className="attachment-preview" style={{
                padding: '12px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                    Voice Message
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                    {Math.round((recordedAudio.duration || 0) / 1000)}s recording
                  </div>
                </div>
                <audio 
                  controls 
                  src={recordedAudio.url}
                  style={{ height: '30px', width: '150px' }}
                />
                <button 
                  onClick={removeRecordedAudio}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'currentColor',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px'
                  }}
                  title="Remove recording"
                >
                  ✕
                </button>
              </div>
            )}

            <textarea
              className="message-input"
              placeholder="Enter a message..."
              rows="1"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onInput={adjustMessageInputHeight}
              onKeyPress={handleKeyPress}
            />
            <div className="message-input-buttons">
              {/* Photo Upload Button */}
              <label className="message-input-button" title="Attach photo">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  style={{ display: 'none' }}
                />
                <svg
                  className="message-input-icon"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17l2.5-3.21L14.5 17H9zm4.5-6L16 14h-6l2.5-3z"/>
                </svg>
              </label>

              {/* Voice Recording Button */}
              <button
                className={`message-input-button ${isRecording ? 'recording' : ''}`}
                title={isRecording ? "Stop recording" : "Record voice message"}
                onClick={isRecording ? stopRecording : startRecording}
                style={{
                  backgroundColor: isRecording ? '#ff4444' : 'transparent'
                }}
              >
                <svg
                  className="message-input-icon"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3ZM19 10v1a7 7 0 0 1-14 0v-1a1 1 0 0 1 2 0v1a5 5 0 0 0 10 0v-1a1 1 0 1 1 2 0ZM12 18.5a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Z" />
                </svg>
              </button>

              {/* Video Call Button */}
              <button className="message-input-button" title="Start video call">
                <svg
                  className="message-input-icon"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 2v-7l-4 2Z" />
                </svg>
              </button>

              {/* Send Button */}
              <button
                className="message-input-button send-button"
                title="Send message"
                onClick={sendMessage}
                disabled={!messageText.trim() && !selectedPhoto && !recordedAudio}
                style={{
                  opacity: (!messageText.trim() && !selectedPhoto && !recordedAudio) ? 0.5 : 1
                }}
              >
                <svg
                  className="message-input-icon"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m21.426 11.095-17-8A.999.999 0 0 0 3.03 4.242L4.969 12 3.03 19.758a.998.998 0 0 0 1.396 1.147l17-8a1 1 0 0 0 0-1.81zM5.481 18.197l.8-3.441L13 12 6.281 9.244l-.8-3.441L19.014 12l-13.533 6.197Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Inbox;
