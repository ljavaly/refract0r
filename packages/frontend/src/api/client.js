// API Client for communicating with the backend

const API_BASE_URL = 'http://localhost:3001/api';

class ApiClient {
    constructor(baseUrl = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
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
            console.error('API request failed:', error);
            throw error;
        }
    }

    // GET request
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Conversation-specific methods
    async getConversations() {
        return this.get('/conversations');
    }

    async getConversation(conversationId) {
        return this.get(`/conversations/${conversationId}`);
    }

    // Video-specific methods
    async getVideos() {
        return this.get('/videos');
    }

    async getVideo(videoId) {
        return this.get(`/videos/${videoId}`);
    }

    // Comment-specific methods
    async getComments() {
        return this.get('/comments');
    }
}

// Create and export a default instance
const apiClient = new ApiClient();

export default apiClient; 