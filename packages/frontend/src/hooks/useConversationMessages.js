import { useState, useEffect, useCallback } from "react";
import wsClient from "../api/ws";
import apiClient from "../api/client";

/**
 * Custom hook to manage conversation messages, including WebSocket handling
 * and "Today" separator logic
 */
export function useConversationMessages(activeConversationId) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState({});
  const [localMessages, setLocalMessages] = useState({});
  const [initialMessageCount, setInitialMessageCount] = useState({});
  const [todaySeparatorAdded, setTodaySeparatorAdded] = useState({});

  // Load conversation details
  const loadConversationDetails = useCallback(async (conversationId) => {
    try {
      const data = await apiClient.getConversation(conversationId);
      const loadedMessages = data.messages || [];

      setMessages(loadedMessages);
      setUsers(data.users || {});
      
      // Track the initial message count (excluding date separators and block notifications)
      const regularMessageCount = loadedMessages.filter(
        m => m.type !== "date" && m.type !== "block_notification"
      ).length;
      setInitialMessageCount(prev => ({ ...prev, [conversationId]: regularMessageCount }));
      
      // Reset the "Today" separator flag for this conversation
      setTodaySeparatorAdded(prev => ({ ...prev, [conversationId]: false }));

      return { messages: loadedMessages, users: data.users || {} };
    } catch (error) {
      console.error("Failed to load conversation details:", error);
      setMessages([]);
      setUsers({});
      return { messages: [], users: {} };
    }
  }, []);

  // Add a message with "Today" separator if needed
  const addMessageWithSeparator = (conversationId, newMessage) => {
    setMessages((prev) => {
      const currentRegularCount = prev.filter(
        m => m.type !== "date" && m.type !== "block_notification"
      ).length;
      const initialCount = initialMessageCount[conversationId] || 0;
      const needsSeparator = !todaySeparatorAdded[conversationId] && currentRegularCount >= initialCount;

      if (needsSeparator) {
        // Mark that we've added the separator for this conversation
        setTodaySeparatorAdded(p => ({ ...p, [conversationId]: true }));
        
        // Add "Today" separator before the new message
        return [
          ...prev,
          {
            id: `date-today-${Date.now()}`,
            type: "date",
            date: "Today",
          },
          newMessage
        ];
      }
      
      return [...prev, newMessage];
    });

    // Update local messages cache
    setLocalMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));
  };

  // Set up WebSocket listeners
  useEffect(() => {
    if (!activeConversationId) return;

    // Handle incoming conversation messages
    const handleConversationMessage = (data) => {
      if (data.type === "conversation_message") {
        const { conversationId, message } = data;

        // Check if this message already exists (to prevent duplicates from echo)
        const messageExists = (prevMessages) => {
          return prevMessages.some((m) => m.id === message.id);
        };

        // Update messages if this is the active conversation (and message doesn't already exist)
        if (conversationId === activeConversationId) {
          setMessages((prev) => {
            if (messageExists(prev)) return prev;
            
            const currentRegularCount = prev.filter(
              m => m.type !== "date" && m.type !== "block_notification"
            ).length;
            const initialCount = initialMessageCount[activeConversationId] || 0;
            const needsSeparator = !todaySeparatorAdded[activeConversationId] && currentRegularCount >= initialCount;

            if (needsSeparator) {
              // Mark that we've added the separator for this conversation
              setTodaySeparatorAdded(p => ({ ...p, [activeConversationId]: true }));
              
              // Add "Today" separator before the new message
              return [
                ...prev,
                {
                  id: `date-today-${Date.now()}`,
                  type: "date",
                  date: "Today",
                },
                message
              ];
            }
            
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
        const { conversationId, message } = data;

        // Add block notification message to the conversation
        if (message && conversationId === activeConversationId) {
          // Check if this message already exists
          const messageExists = (prevMessages) => {
            return prevMessages.some((m) => m.id === message.id);
          };

          // Update messages if this is the active conversation
          setMessages((prev) => {
            if (messageExists(prev)) return prev;
            const updatedMessages = [...prev, message];
            return updatedMessages;
          });

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
      }
    };

    wsClient.onWebSocketMessage("conversation_message", handleConversationMessage);
    wsClient.onWebSocketMessage("block_conversation", handleBlockConversation);

    // Cleanup listener on unmount
    return () => {
      wsClient.offWebSocketMessage("conversation_message", handleConversationMessage);
      wsClient.offWebSocketMessage("block_conversation", handleBlockConversation);
    };
  }, [activeConversationId, initialMessageCount, todaySeparatorAdded]);

  // Cleanup audio URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up audio URLs in local messages
      Object.values(localMessages)
        .flat()
        .forEach((message) => {
          if (message.audio && message.audio.url) {
            URL.revokeObjectURL(message.audio.url);
          }
        });
    };
  }, []); // Empty dependency array means this runs only on unmount

  return {
    messages,
    users,
    loadConversationDetails,
    addMessageWithSeparator,
  };
}

