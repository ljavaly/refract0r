// WebSocket client for sending and receiving messages in real-time

const WS_BASE_URL = "ws://localhost:3001/ws/comments";

class WsClient {
  constructor() {
    this.ws = null;
    // Map<string, Set<Function>> of listeners by message type
    this.wsListeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  // WebSocket methods
  connectWebSocket() {
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING)
    ) {
      // Already connected or in progress
      return;
    }

    try {
      this.ws = new WebSocket(WS_BASE_URL);

      this.ws.onopen = () => {
        console.log("🔌 WebSocket connected");
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleWebSocketMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onclose = (event) => {
        console.log("🔌 WebSocket disconnected:", event.code, event.reason);
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
    }
  }

  disconnectWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`,
      );

      setTimeout(() => {
        this.connectWebSocket();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  handleWebSocketMessage(data) {
    // Notify listeners registered for this type and for 'all'
    const notifyType = (type) => {
      const listeners = this.wsListeners.get(type);
      if (listeners && listeners.size > 0) {
        listeners.forEach((cb) => {
          try {
            cb(data);
          } catch (e) {
            console.error("WebSocket listener error:", e);
          }
        });
      }
    };
    notifyType("all");
    if (data && data.type) notifyType(data.type);
  }

  // Subscribe to WebSocket messages
  onWebSocketMessage(type, callback) {
    const set = this.wsListeners.get(type) || new Set();
    set.add(callback);
    this.wsListeners.set(type, set);
  }

  // Unsubscribe from WebSocket messages
  offWebSocketMessage(type, callback) {
    const set = this.wsListeners.get(type);
    if (!set) return;
    set.delete(callback);
    if (set.size === 0) {
      this.wsListeners.delete(type);
    } else {
      this.wsListeners.set(type, set);
    }
  }

  // Send comment through WebSocket
  sendComment(user, message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const commentData = {
        type: "comment",
        user: user,
        message: message,
        timestamp: new Date().toISOString(),
      };

      this.ws.send(JSON.stringify(commentData));
      return true;
    } else {
      console.error("WebSocket not connected");
      return false;
    }
  }

  // Send ping to keep connection alive
  ping() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "ping" }));
    }
  }
}

// TODO LAUREN this should not be a singleton
const wsClient = new WsClient();

export default wsClient;
