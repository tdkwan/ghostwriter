interface BackendResponse {
  word: string;
  type: string;
  delay?: number;
}

// Extend ImportMeta interface for Vite environment variables
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_BASE_URL?: string;
      readonly VITE_BACKEND_URL?: string;
    };
  }
}

class BackendService {
  private baseUrl: string;
  private isConnected: boolean = false;

  constructor(baseUrl?: string) {
    // Use environment variable or fallback to default
    this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL || '/api';
  }

  // Test connection to Python backend
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing connection to:', this.baseUrl);
      const response = await fetch(`${this.baseUrl}/health`);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      this.isConnected = response.ok;
      return this.isConnected;
    } catch (error) {
      console.error('Backend connection failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  // Get next word from Python backend
  async getNextWord(context?: string): Promise<BackendResponse | null> {
    if (!this.isConnected) {
      console.warn('Backend not connected');
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/generate-word`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context }),
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error getting word from backend:', error);
      return null;
    }
  }

  // Stream words from Python backend
  async* streamWords(context?: string): AsyncGenerator<BackendResponse> {
    if (!this.isConnected) {
      throw new Error('Backend not connected');
    }

    try {
      const response = await fetch(`${this.baseUrl}/stream-words`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context }),
      });

      if (!response.ok) {
        throw new Error('Stream request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const wordData = JSON.parse(line);
              yield wordData;
            } catch (e) {
              console.warn('Invalid JSON from stream:', line);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error streaming words:', error);
      throw error;
    }
  }

  // Send user interaction back to backend
  async sendInteraction(word: string, action: string): Promise<void> {
    if (!this.isConnected) return;

    try {
      await fetch(`${this.baseUrl}/interaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word, action }),
      });
    } catch (error) {
      console.error('Error sending interaction:', error);
    }
  }

  // Get appropriate message based on user data
  async getMessage(message?: any): Promise<{ word: string; type: string }[] | null> {
    if (!this.isConnected) {
      console.warn('Backend not connected');
      return null;
    }

    try {
      console.log('Getting message with data:', message);
      const response = await fetch(`${this.baseUrl}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        const data = await response.json();
        return data.message || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting message:', error);
      return null;
    }
  }

  // Get onboarding message from backend (legacy method)
  async getOnboardingMessage(): Promise<{ word: string; type: string }[] | null> {
    return this.getMessage({ type: 'onboarding' });
  }
}

export default BackendService;
