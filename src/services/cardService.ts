import { VideoCard, CardFormData } from '../types/cards';

const API_BASE = '/api'; // Replace with your actual API base URL

export class CardService {
  // Get all cards for a video
  static async getVideoCards(videoId: string): Promise<VideoCard[]> {
    try {
      const response = await fetch(`${API_BASE}/videos/${videoId}/cards`);
      if (!response.ok) throw new Error('Failed to fetch cards');
      return await response.json();
    } catch (error) {
      console.error('Error fetching video cards:', error);
      return [];
    }
  }

  // Create a new card
  static async createCard(videoId: string, cardData: CardFormData): Promise<VideoCard> {
    try {
      const response = await fetch(`${API_BASE}/videos/${videoId}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Adjust as needed
        },
        body: JSON.stringify(cardData),
      });
      
      if (!response.ok) throw new Error('Failed to create card');
      return await response.json();
    } catch (error) {
      console.error('Error creating card:', error);
      throw error;
    }
  }

  // Update an existing card
  static async updateCard(videoId: string, cardId: string, cardData: Partial<CardFormData>): Promise<VideoCard> {
    try {
      const response = await fetch(`${API_BASE}/videos/${videoId}/cards/${cardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(cardData),
      });
      
      if (!response.ok) throw new Error('Failed to update card');
      return await response.json();
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  }

  // Delete a card
  static async deleteCard(videoId: string, cardId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/videos/${videoId}/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to delete card');
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  }

  // Search for videos/playlists/channels for card linking
  static async searchContent(query: string, type: 'video' | 'playlist' | 'channel'): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&type=${type}`);
      if (!response.ok) throw new Error('Failed to search content');
      return await response.json();
    } catch (error) {
      console.error('Error searching content:', error);
      return [];
    }
  }

  // Validate external URL
  static async validateUrl(url: string): Promise<{ isValid: boolean; title?: string; thumbnail?: string }> {
    try {
      const response = await fetch(`${API_BASE}/validate-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) throw new Error('Failed to validate URL');
      return await response.json();
    } catch (error) {
      console.error('Error validating URL:', error);
      return { isValid: false };
    }
  }
}