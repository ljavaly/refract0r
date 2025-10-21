import "../styles/Inbox.css";
import apiClient from "../api/client.js";
import wsClient from "../api/ws";
import Conversation from "./Conversation.jsx";

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

  // Handle sending messages from the conversation component
  const handleSendMessage = (message) => {
    // Add message to local messages store for this conversation
    setLocalMessages(prev => ({
      ...prev,
      [activeConversation]: [...(prev[activeConversation] || []), message]
    }));
    
    // Also add to current messages display
    setMessages(prev => [...prev, message]);
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
      // Clean up audio URLs in local messages
      Object.values(localMessages).flat().forEach(message => {
        if (message.audio && message.audio.url) {
          URL.revokeObjectURL(message.audio.url);
        }
      });
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

        {/* Conversation Area */}
        <Conversation 
          activeConversation={activeConversation}
          conversations={conversations}
          messages={messages}
          users={users}
          localMessages={localMessages}
          onSendMessage={handleSendMessage}
          onDropdownToggle={handleDropdownToggle}
          onBlock={handleBlock}
          showDropdown={showDropdown}
        />
      </div>
    </>
  );
}

export default Inbox;
