import "../styles/Inbox.css";
import { ConversationSchema, MessageSchema } from "../../../shared/types.js";
import apiClient from "../api/client.js";

import React, { useState, useEffect } from "react";

function Inbox() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
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
      setMessages(data.messages || []);
      setUsers(data.users || {});
    } catch (err) {
      console.error("Failed to load conversation details:", err);
      setError("Failed to load conversation details");
    } finally {
      setLoading(false);
    }
  };

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
              Inbox ({conversations.filter((c) => c.unread).length})
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
                onClick={() => setActiveConversation(conv.id)}
              >
                {conv.new && (
                  <div className="conversation-unread-indicator">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      ></path>
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
                  <div className="conversation-name">
                    {conv.name}
                    {conv.isGroup && (
                      <span className="ml-1 text-xs text-gray-400">
                        ({conv.participants})
                      </span>
                    )}
                  </div>
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
            <div>
              <span className="main-content-title">
                {(activeConversation &&
                  conversations.find((c) => c.id === activeConversation)
                    ?.name) ||
                  "Select a conversation"}
              </span>
              {activeConversation &&
                conversations.find((c) => c.id === activeConversation)
                  ?.isGroup && (
                  <span className="main-content-subtitle">
                    {
                      conversations.find((c) => c.id === activeConversation)
                        ?.participants
                    }{" "}
                    participants
                  </span>
                )}
            </div>
            {/* Removed the settings icon here */}
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
                          <div className="message-text">
                            {message.text}{" "}
                            {message.emoji && (
                              <span className="emoji">{message.emoji}</span>
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
            <textarea
              className="message-input"
              placeholder="Send a message"
              rows="1" // Start with one row
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
}

export default Inbox;
