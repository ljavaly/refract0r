import React, { useEffect, useState } from "react";
import "../styles/Admin.css";
import AudienceChat from "./AudienceChat.jsx";
import Conversation from "./Conversation.jsx";
import apiClient from "../api/client.js";
import wsClient from "../api/ws";

function Admin() {
  const [queuedComments, setQueuedComments] = useState([]);
  const [selectedScene, setSelectedScene] = useState("");
  const [activeTab, setActiveTab] = useState("audience-chat");
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversation] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    wsClient.connectWebSocket();
    loadConversations();

    // Listen for incoming conversation messages via WebSocket
    const handleConversationMessage = (data) => {
      if (data.type === "conversation_message") {
        const { conversationId, message } = data;

        // Check if this message already exists (to prevent duplicates from echo)
        const messageExists = (prevMessages) => {
          return prevMessages.some((m) => m.id === message.id);
        };

        // Update messages if this is the active conversation (and message doesn't already exist)
        if (conversationId === selectedConversationId) {
          setMessages((prev) => {
            if (messageExists(prev)) return prev;
            return [...prev, message];
          });
        }

        // Also update local messages cache
        setLocalMessages((prev) => ({
          ...prev,
          [conversationId]: (() => {
            const existing = prev[conversationId] || [];
            if (existing.some((m) => m.id === message.id)) return existing;
            return [...existing, message];
          })(),
        }));
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
  }, [selectedConversationId]);

  // Load conversation details when selected conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      loadConversationDetails(selectedConversationId);
    }
  }, [selectedConversationId]);

  const loadConversations = () => {
    apiClient
      .getConversations()
      .then((data) => {
        // Preserve blocked status from existing conversations
        setConversations((prevConversations) => {
          return data.map((newConv) => {
            const existingConv = prevConversations.find(
              (c) => c.id === newConv.id,
            );
            return {
              ...newConv,
              blocked: existingConv?.blocked || false,
            };
          });
        });
      })
      .catch((error) => {
        console.log("Failed to load conversations:", error);
        setConversations([]);
      });
  };

  const loadConversationDetails = async (conversationId) => {
    try {
      const data = await apiClient.getConversation(conversationId);
      const loadedMessages = data.messages || [];

      // Merge loaded messages with any local messages for this conversation
      const conversationLocalMessages = localMessages[conversationId] || [];
      const allMessages = [...loadedMessages, ...conversationLocalMessages];

      setMessages(allMessages);
      setUsers(data.users || {});
    } catch (error) {
      console.error("Failed to load conversation details:", error);
      setMessages([]);
      setUsers({});
    }
  };

  const loadSceneComments = (scene) => {
    if (!scene) {
      // Clear comments when no scene is selected
      setSelectedScene("");
      setQueuedComments([]);
      return;
    }

    setSelectedScene(scene);
    apiClient
      .getCommentsByScene(scene)
      .then((data) => {
        setQueuedComments(data);
      })
      .catch((error) => {
        console.log("Failed to load scene comments:", error);
        setQueuedComments([]);
      });
  };

  const sendTestMessage = () => {
    if (wsClient.ws && wsClient.ws.readyState === WebSocket.OPEN) {
      const testMessage = {
        type: "unreadMessage",
        user: "Admin",
        timestamp: new Date().toISOString(),
        sessionId: wsClient.sessionId,
      };

      wsClient.ws.send(JSON.stringify(testMessage));
    } else {
      console.warn(
        "WebSocket not connected. State:",
        wsClient.ws ? wsClient.ws.readyState : "WebSocket is null",
      );
    }
  };

  const sendNextComment = () => {
    if (wsClient.ws && wsClient.ws.readyState === WebSocket.OPEN) {
      let nextComment = queuedComments[0];
      if (!nextComment) {
        console.log("No more comments to send, skipping...");
        return;
      }

      wsClient.sendComment(nextComment.user, nextComment.message);

      if (queuedComments.length > 1) {
        setQueuedComments(queuedComments.slice(1));
      } else {
        console.log(
          "No more comments to send, setting queuedComments to empty array...",
        );
        setQueuedComments([]);
      }
    }
  };

  const handleSendMessage = (messageData) => {
    if (!selectedConversationId) return;

    // Create a new message object with current time
    const now = new Date();
    const newMessage = {
      id: `local-${Date.now()}`,
      conversationId: selectedConversationId,
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

    // Immediately add to local state for optimistic UI update
    setMessages((prev) => [...prev, newMessage]);
    setLocalMessages((prev) => ({
      ...prev,
      [selectedConversationId]: [
        ...(prev[selectedConversationId] || []),
        newMessage,
      ],
    }));

    // Send message via WebSocket to broadcast to all clients
    const wsMessage = {
      type: "conversation_message",
      conversationId: selectedConversationId,
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

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleBlock = () => {
    if (!selectedConversationId) return;

    const conversation = conversations.find(
      (c) => c.id === selectedConversationId,
    );
    if (!conversation) return;

    const confirmed = window.confirm(
      `Are you sure you want to block ${conversation.name}?`,
    );

    if (confirmed) {
      // Send block message via WebSocket to all clients
      const blockMessage = {
        type: "block_conversation",
        conversationId: selectedConversationId,
        conversationName: conversation.name,
        timestamp: new Date().toISOString(),
      };

      const sent = wsClient.sendMessage(blockMessage);

      if (sent) {
        console.log("Block message sent via WebSocket:", blockMessage);
      } else {
        console.warn("WebSocket not available, block not sent");
      }

      // Close dropdown
      setShowDropdown(false);
    }
  };

  return (
    <div className="admin-cues-container">
      <div className="admin-controls mb-4">
        <button onClick={sendTestMessage} className="test-message-button">
          Trigger "You have a new message"
        </button>
      </div>
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "audience-chat" ? "active" : ""}`}
          onClick={() => setActiveTab("audience-chat")}
        >
          Audience Chat
        </button>
        <button
          className={`admin-tab ${activeTab === "inbox" ? "active" : ""}`}
          onClick={() => setActiveTab("inbox")}
        >
          Inbox
        </button>
      </div>

      {activeTab === "audience-chat" && (
        <>
          <div className="grid grid-cols-5 justify-center admin-cues-grid items-center">
            <section className="admin-cues-section grid col-span-2">
              <div className="mb-4">
                <select
                  id="scene-select"
                  value={selectedScene}
                  onChange={(e) => loadSceneComments(e.target.value)}
                  className="scene-select-dropdown"
                >
                  <option value="">Choose a scene...</option>
                  <option value="1_rp_home_invasion">
                    1 - RP Home Invasion
                  </option>
                  <option value="2_grwm_big_brother_fresh_direct_1">
                    2 - GRWM Big Brother Fresh Direct 1
                  </option>
                  <option value="3_ama_carlucci_brothers">
                    3 - AMA Carlucci Brothers
                  </option>
                  <option value="4_grwm_survivor">4 - GRWM Survivor</option>
                  <option value="5_ama_coney_island">
                    5 - AMA Coney Island
                  </option>
                  <option value="6_workout">6 - Workout</option>
                  <option value="7_angusxbeef">7 - Angus x Beef</option>
                  <option value="8_fresh_direct_2">8 - Fresh Direct 2</option>
                  <option value="9_wolf">9 - Wolf</option>
                  <option value="10_rick_morty">10 - Rick and Morty</option>
                  <option value="11_mirror_test">11 - Mirror Test</option>
                  <option value="12_grace">12 - Grace</option>
                </select>
              </div>
              <AudienceChat initialComments={queuedComments} isAdmin={true} />
            </section>
            <div className="flex justify-center items-center col-span-1">
              <button onClick={sendNextComment} className="test-message-button">
                Send next ➡️
              </button>
            </div>
            <section className="admin-cues-section grid col-span-2">
              <AudienceChat />
            </section>
          </div>
        </>
      )}

      {activeTab === "inbox" && (
        <div className="admin-inbox-tab">
          <div className="conversation-picker-container">
            <select
              id="conversation-select"
              value={selectedConversationId}
              onChange={(e) => setSelectedConversation(e.target.value)}
              className="conversation-select-dropdown"
            >
              <option value="">Choose a conversation...</option>
              {conversations.map((conversation) => (
                <option key={conversation.id} value={conversation.id}>
                  {conversation.name}
                </option>
              ))}
            </select>
          </div>
          {selectedConversationId && (
            <div className="admin-conversation-wrapper">
              <Conversation
                activeConversation={selectedConversationId}
                conversations={conversations}
                messages={messages}
                users={users}
                onSendMessage={handleSendMessage}
                onDropdownToggle={handleDropdownToggle}
                onBlock={handleBlock}
                showDropdown={showDropdown}
                isBlocked={
                  conversations.find((c) => c.id === selectedConversationId)
                    ?.blocked || false
                }
                username={
                  conversations.find((c) => c.id === selectedConversationId)
                    ?.name
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Admin;
