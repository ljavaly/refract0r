// API Client for communicating with the backend

import { HOST, HTTP_PROTOCOL } from "./utils";

const API_BASE_URL = `${HTTP_PROTOCOL}://${HOST}/api`;

class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    // Add cache-busting parameter and random component for all requests
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const cacheBuster = `${endpoint.includes("?") ? "&" : "?"}_cb=${timestamp}&_r=${random}`;
    const url = `${this.baseUrl}${endpoint}${cacheBuster}`;

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
        "If-Modified-Since": "0",
        "X-Requested-With": "XMLHttpRequest",
      },
      cache: "no-store", // Fetch API cache option
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  // Conversation-specific methods
  async getConversations() {
    return this.get("/conversations");
  }

  async getConversation(conversationId) {
    return this.get(`/conversations/${conversationId}`);
  }

  // Video-specific methods
  async getVideos() {
    return this.get("/videos");
  }

  async getVideo(videoId) {
    return this.get(`/videos/${videoId}`);
  }

  // Comment-specific methods
  async getComments() {
    return this.get("/comments");
  }

  async getCommentsByScene(sceneId) {
    return this.get(`/comments/${sceneId}`);
  }
}

// Create and export a default instance
const apiClient = new ApiClient();

export default apiClient;
