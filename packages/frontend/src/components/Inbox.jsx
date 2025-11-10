import "../styles/Inbox.css";
import apiClient from "../api/client.js";
import wsClient from "../api/ws";
import Conversation from "./Conversation.jsx";
import { useConversationMessages } from "../hooks/useConversationMessages.js";

import React, { useState, useEffect } from "react";

function Inbox() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Use custom hook for conversation messages
  const {
    messages,
    users,
    loadConversationDetails: loadConversationDetailsFromHook,
    addMessageWithSeparator,
  } = useConversationMessages(activeConversation);

  // On component mount, load conversations and clear unread message (only once)
  useEffect(() => {
    loadConversations();
    wsClient.connectWebSocket();

    // Wait for WebSocket to be ready before sending clearUnreadMessage
    wsClient
      .whenReady(() => {
        wsClient.clearUnreadMessage();
      })
      .catch((error) => {
        console.warn("Failed to clear unread message:", error);
      });
  }, []); // Empty dependency array - only run once on mount

  // Set up WebSocket listeners for conversation list updates
  useEffect(() => {
    // Listen for incoming conversation messages to update conversation list
    const handleConversationMessage = (data) => {
      if (data.type === "conversation_message") {
        const { conversationId, message } = data;

        // Update conversation list: move to top, show unread indicator, update last message
        setConversations((prevConversations) => {
          const conversationIndex = prevConversations.findIndex(
            (c) => c.id === conversationId,
          );
          if (conversationIndex === -1) return prevConversations;

          const updatedConversations = [...prevConversations];
          const conversation = { ...updatedConversations[conversationIndex] };

          // Extract message text for preview
          const messageText =
            message.text ||
            message.content ||
            (message.photo ? "📷 Photo" : "") ||
            (message.audio ? "🎤 Voice message" : "Message");

          // Update conversation properties
          conversation.lastMessage = messageText;
          conversation.time = new Date()
            .toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })
            .toLowerCase();

          // Only show unread indicator if this is NOT the active conversation
          if (conversationId !== activeConversation) {
            conversation.new = true;
          }

          // Remove from current position
          updatedConversations.splice(conversationIndex, 1);

          // Add to top
          return [conversation, ...updatedConversations];
        });
      }
    };

    // Listen for block conversation messages
    const handleBlockConversation = (data) => {
      if (data.type === "block_conversation") {
        const { conversationId } = data;

        // Update conversation to show blocked status
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === conversationId ? { ...conv, blocked: true } : conv,
          ),
        );
      }
    };

    wsClient.onWebSocketMessage(
      "conversation_message",
      handleConversationMessage,
    );
    wsClient.onWebSocketMessage("block_conversation", handleBlockConversation);

    // Cleanup listener on unmount
    return () => {
      wsClient.offWebSocketMessage(
        "conversation_message",
        handleConversationMessage,
      );
      wsClient.offWebSocketMessage(
        "block_conversation",
        handleBlockConversation,
      );
    };
  }, [activeConversation]);

  // Load conversation details when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      loadConversationDetailsFromHook(activeConversation).then(() => {
        setLoading(false);
      });
    }
  }, [activeConversation, loadConversationDetailsFromHook]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getConversations();

      // Preserve blocked and unread status from existing conversations
      setConversations((prevConversations) => {
        const updatedConversations = data.map((newConv) => {
          const existingConv = prevConversations.find(
            (c) => c.id === newConv.id,
          );
          return {
            ...newConv,
            blocked: existingConv?.blocked || false,
            // Preserve the local unread status if it was cleared
            new: existingConv ? existingConv.new : newConv.new,
          };
        });
        return updatedConversations;
      });

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


  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleConversationClick = (conversationId) => {
    // Set the active conversation
    setActiveConversation(conversationId);

    // Clear the unread indicator locally (only in UI, not in underlying data)
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === conversationId ? { ...conv, new: false } : conv,
      ),
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
          // Send consolidated block message via WebSocket to all clients
          const now = new Date();
          const blockMessage = {
            type: "block_conversation",
            conversationId: activeConversation,
            conversationName: conversation.name,
            timestamp: now.toISOString(),
            message: {
              id: `block-notification-${Date.now()}`,
              conversationId: activeConversation,
              user: "system",
              content: "You have been blocked by TRENT4YOU",
              timestamp: now.toISOString(),
              time: now
                .toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })
                .toLowerCase(),
              type: "block_notification",
            },
          };

          const sent = wsClient.sendMessage(blockMessage);

          if (sent) {
            console.log("Block message sent via WebSocket:", blockMessage);
          } else {
            console.warn("WebSocket not available, block not sent");
          }

          // Remove blocked conversation from list by filtering out the conversation with matching name
          setConversations((prevConversations) =>
            prevConversations.filter((c) => c.name !== conversation.name),
          );

          // Clear active conversation if it was the blocked one
          if (activeConversation === conversation.id) {
            setActiveConversation(null);
          }
        }
      }
    }
    setShowDropdown(false);
  };

  // Handle sending messages from the conversation component
  const handleSendMessage = (messageData) => {
    if (!activeConversation) return;

    // Create a new message object with current time
    const now = new Date();
    const newMessage = {
      id: `local-${Date.now()}`,
      conversationId: activeConversation,
      sender: "user",
      content: messageData.text || "",
      timestamp: now.toISOString(),
      time: now
        .toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
        .toLowerCase(),
      type: messageData.type || "text",
      ...messageData,
    };

    // Add message with "Today" separator if needed
    addMessageWithSeparator(activeConversation, newMessage);

    // Send message via WebSocket to broadcast to all clients
    const wsMessage = {
      type: "conversation_message",
      conversationId: activeConversation,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    const sent = wsClient.sendMessage(wsMessage);

    if (sent) {
      console.log("Message sent via WebSocket:", newMessage);
    } else {
      console.warn("WebSocket not available, message not sent");
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
                    {conv.blocked ? (
                      <span style={{ color: "#999", fontStyle: "italic" }}>
                        Blocked
                      </span>
                    ) : (
                      conv.lastMessage
                    )}
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
          onSendMessage={handleSendMessage}
          onDropdownToggle={handleDropdownToggle}
          onBlock={handleBlock}
          showDropdown={showDropdown}
          isBlocked={
            conversations.find((c) => c.id === activeConversation)?.blocked ||
            false
          }
        />
      </div>
    </>
  );
}

export default Inbox;
