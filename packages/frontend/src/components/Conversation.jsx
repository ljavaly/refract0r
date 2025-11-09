import "../styles/Conversation.css";
import React, { useState, useEffect } from "react";

// Soundwave animation component
function SoundwaveAnimation({ isActive, size = "small" }) {
  const barCount = size === "large" ? 20 : 8;
  const barHeight = size === "large" ? "20px" : "12px";
  const barWidth = size === "large" ? "2px" : "1.5px";
  const gapSize = size === "large" ? "2px" : "1.5px";

  return (
    <div
      className={`soundwave ${isActive ? "active" : ""}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: barHeight,
        gap: gapSize,
      }}
    >
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className="soundwave-bar"
          style={{
            width: barWidth,
            backgroundColor: "currentColor",
            borderRadius: "1px",
            height: "100%",
            animation: isActive
              ? `soundwave-${i % 5} 1.2s ease-in-out infinite`
              : "none",
            animationDelay: `${(i % 5) * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}

function Conversation({
  activeConversation,
  conversations,
  messages,
  users,
  onSendMessage,
  onDropdownToggle,
  onBlock,
  showDropdown,
  isBlocked = false,
  username = "TRENT4YOU",
}) {
  const [messageText, setMessageText] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);

  // Handle photo selection
  const handlePhotoSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedPhoto({
          file: file,
          preview: e.target.result,
          name: file.name,
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
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio({
          blob: audioBlob,
          url: audioUrl,
          duration: Date.now() - window.recordingStartTime,
        });
        stream.getTracks().forEach((track) => track.stop());
      };

      setMediaRecorder(recorder);
      setIsRecording(true);
      recorder.start();
      window.recordingStartTime = Date.now();
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please check permissions.");
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

  // Handle audio play/pause events
  const handleAudioPlay = (audioElement) => {
    setPlayingAudio(audioElement.src);
  };

  const handleAudioPause = (audioElement) => {
    setPlayingAudio(null);
  };

  const handleAudioEnded = (audioElement) => {
    setPlayingAudio(null);
  };

  // Send message (text, photo, or voice memo)
  const sendMessage = () => {
    if (!activeConversation || isBlocked) return;

    const hasContent = messageText.trim() || selectedPhoto || recordedAudio;
    if (!hasContent) return;

    // Create message object
    const message = {
      id: Date.now().toString(),
      user: username,
      timestamp: new Date().toISOString(),
      type: "message",
    };

    if (messageText.trim()) {
      message.text = messageText.trim();
    }

    if (selectedPhoto) {
      message.photo = {
        name: selectedPhoto.name,
        url: selectedPhoto.preview, // In a real app, you'd upload this to a server
        type: "image",
      };
    }

    if (recordedAudio) {
      // Create a new blob URL that won't be revoked for the message
      const messageAudioUrl = URL.createObjectURL(recordedAudio.blob);
      message.audio = {
        url: messageAudioUrl, // In a real app, you'd upload this to a server
        duration: Math.round((recordedAudio.duration || 0) / 1000),
        type: "audio",
        blob: recordedAudio.blob, // Keep reference to blob for potential cleanup later
      };
    }

    // Call parent's send message handler
    onSendMessage(message);

    // Clear inputs
    setMessageText("");
    removeSelectedPhoto();
    removeRecordedAudio();

    // Reset textarea height
    const textarea = document.querySelector(".message-input");
    if (textarea) {
      textarea.style.height = "auto";
    }
  };

  // Handle Enter key to send message
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // Adjust message input height
  const adjustMessageInputHeight = (e) => {
    // Reset height to measure content
    const savedHeight = e.target.style.height;
    e.target.style.height = "auto";

    // Calculate new height based on scroll height
    const newHeight = Math.min(e.target.scrollHeight, 120); // Max 120px
    e.target.style.height = `${newHeight}px`;

    // If content doesn't need scrolling, ensure minimum height
    if (e.target.scrollHeight <= e.target.clientHeight) {
      e.target.style.height = "auto";
    }
  };

  // Cleanup audio URLs when component unmounts or conversation changes
  useEffect(() => {
    return () => {
      // Clean up current recorded audio if any
      if (recordedAudio?.url) {
        URL.revokeObjectURL(recordedAudio.url);
      }
    };
  }, [activeConversation]);

  if (!activeConversation) {
    return (
      <div className="main-content">
        <div className="no-conversation-selected">
          <h3>Select a conversation to start messaging</h3>
        </div>
      </div>
    );
  }

  const currentConversation = conversations.find(
    (c) => c.id === activeConversation,
  );

  return (
    <div className="main-content">
      <div className="main-content-header">
        <div className="header-title-container">
          <span className="main-content-title">
            {currentConversation?.name || "Select a conversation"}
          </span>
          <div className="dropdown-menu-container">
            <button
              className="dropdown-toggle-button"
              onClick={onDropdownToggle}
              title="More options"
            >
              ⋮
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={onBlock}>
                  Block
                </button>
                <button
                  className="dropdown-item"
                  onClick={onBlock}
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
                const avatar = message.avatar || (user ? user.avatar : null);

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
                          <div
                            className={`message-photo-container ${!message.text ? "no-text" : ""}`}
                          >
                            <img
                              src={message.photo.url}
                              alt={message.photo.name}
                              className="message-photo-img"
                            />
                          </div>
                        )}
                        {message.audio && (
                          <div
                            className={`message-audio-container ${!message.text ? "no-text" : ""}`}
                          >
                            <div className="audio-player">
                              {/* Play button */}
                              <button
                                onClick={() => {
                                  const audio = document.querySelector(
                                    `audio[src="${message.audio.url}"]`,
                                  );
                                  if (audio) {
                                    if (playingAudio === message.audio.url) {
                                      audio.pause();
                                    } else {
                                      audio.play();
                                    }
                                  }
                                }}
                                className="audio-play-button"
                              >
                                {playingAudio === message.audio.url
                                  ? "⏸"
                                  : "▶"}
                              </button>

                              {/* Soundwave where time used to be */}
                              <div className="audio-soundwave-container">
                                <div style={{ color: "var(--color-accent)" }}>
                                  <SoundwaveAnimation
                                    isActive={
                                      playingAudio === message.audio.url
                                    }
                                    size="large"
                                  />
                                </div>
                              </div>

                              {/* Hidden audio element for playback */}
                              <audio
                                src={message.audio.url}
                                className="audio-hidden"
                                onPlay={(e) => handleAudioPlay(e.target)}
                                onPause={(e) => handleAudioPause(e.target)}
                                onEnded={(e) => handleAudioEnded(e.target)}
                              />
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

      <div className={`message-input-area ${isBlocked ? "blocked" : ""}`}>
        {/* Photo Preview */}
        {selectedPhoto && (
          <div className="attachment-preview">
            <img
              src={selectedPhoto.preview}
              alt="Selected photo"
              className="attachment-preview-image"
            />
            <div className="attachment-preview-content">
              <div className="attachment-preview-title">
                {selectedPhoto.name}
              </div>
              <div className="attachment-preview-subtitle">
                Photo ready to send
              </div>
            </div>
            <button
              onClick={removeSelectedPhoto}
              className="attachment-preview-remove"
              title="Remove photo"
            >
              ✕
            </button>
          </div>
        )}

        {/* Voice Recording Preview */}
        {recordedAudio && (
          <div className="attachment-preview">
            <div className="voice-preview-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
              </svg>
            </div>
            <div className="attachment-preview-content">
              <div className="attachment-preview-title">Voice Message</div>
              <div className="attachment-preview-subtitle">
                {Math.round((recordedAudio.duration || 0) / 1000)}s recording
              </div>
            </div>
            <div className="voice-preview-controls">
              {/* Play button */}
              <button
                onClick={() => {
                  const audio = document.querySelector(
                    `audio[src="${recordedAudio.url}"]`,
                  );
                  if (audio) {
                    if (playingAudio === recordedAudio.url) {
                      audio.pause();
                    } else {
                      audio.play();
                    }
                  }
                }}
                className="audio-play-button"
              >
                {playingAudio === recordedAudio.url ? "⏸" : "▶"}
              </button>

              {/* Soundwave */}
              <div className="voice-preview-soundwave">
                <div style={{ color: "var(--color-accent)" }}>
                  <SoundwaveAnimation
                    isActive={playingAudio === recordedAudio.url}
                    size="large"
                  />
                </div>
              </div>

              {/* Hidden audio element */}
              <audio
                src={recordedAudio.url}
                className="audio-hidden"
                onPlay={(e) => handleAudioPlay(e.target)}
                onPause={(e) => handleAudioPause(e.target)}
                onEnded={(e) => handleAudioEnded(e.target)}
              />
            </div>
            <button
              onClick={removeRecordedAudio}
              className="attachment-preview-remove"
              title="Remove recording"
            >
              ✕
            </button>
          </div>
        )}

        <div className="message-input-row">
          <textarea
            className="message-input"
            placeholder={
              isBlocked ? "This conversation is blocked" : "Enter a message..."
            }
            rows="1"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onInput={adjustMessageInputHeight}
            onKeyPress={handleKeyPress}
            disabled={isBlocked}
          />
          <div className="message-input-buttons">
            {/* Photo Upload Button */}
            <label
              className="message-input-button"
              title="Attach photo"
              style={{
                opacity: isBlocked ? 0.4 : 1,
                pointerEvents: isBlocked ? "none" : "auto",
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                style={{ display: "none" }}
                disabled={isBlocked}
              />
              <svg
                className="message-input-icon"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                <circle cx="8.5" cy="8.5" r="1.5" />
              </svg>
            </label>

            {/* Voice Recording Button */}
            <button
              className={`message-input-button ${isRecording ? "recording" : ""}`}
              title={isRecording ? "Stop recording" : "Record voice message"}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isBlocked}
              style={{
                backgroundColor: isRecording ? "#ff4444" : "transparent",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                opacity: isBlocked ? 0.4 : 1,
              }}
            >
              {isRecording ? (
                <div style={{ width: "20px", height: "12px" }}>
                  <SoundwaveAnimation isActive={true} size="small" />
                </div>
              ) : (
                <svg
                  className="message-input-icon"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3ZM19 10v1a7 7 0 0 1-14 0v-1a1 1 0 0 1 2 0v1a5 5 0 0 0 10 0v-1a1 1 0 1 1 2 0ZM12 18.5a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Z" />
                </svg>
              )}
            </button>

            {/* Video Call Button */}
            <button
              className="message-input-button"
              title="Start video call"
              disabled={isBlocked}
              style={{ opacity: isBlocked ? 0.4 : 1 }}
            >
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
              disabled={
                isBlocked ||
                (!messageText.trim() && !selectedPhoto && !recordedAudio)
              }
              style={{
                opacity:
                  isBlocked ||
                  (!messageText.trim() && !selectedPhoto && !recordedAudio)
                    ? 0.5
                    : 1,
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
  );
}

export default Conversation;
