// API configuration and base client
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api' 
  : 'http://localhost:3009/api';

// Types for API responses
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  isVerified: boolean;
  isCreator: boolean;
  emailVerified: boolean;
  subscriberCount: number;
  videoCount: number;
  totalViews: number;
  privacy: 'PUBLIC' | 'UNLISTED' | 'PRIVATE';
  preferences: Record<string, any>;
  createdAt: string;
  channels?: Channel[];
}

export interface Channel {
  id: string;
  name: string;
  handle: string;
  profilePicture?: string;
  bannerImage?: string;
  subscriberCount: number;
  isVerified: boolean;
  description?: string;
  category?: string;
  country?: string;
  language: string;
  monetizationEnabled: boolean;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  videoUrl?: string;
  duration?: number;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  createdAt: string;
  creator: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    isVerified: boolean;
    subscriberCount?: number;
  };
  qualityVersions?: {
    quality: string;
    url: string;
    fileSize: number;
  }[];
  userInteraction?: {
    isLiked: boolean;
    isDisliked: boolean;
    isInWatchLater: boolean;
    isSubscribed: boolean;
    resumeTime?: number;
  };
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  results?: T[];
  videos?: T[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
    total?: number;
  };
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('authToken');
  }

  public setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  public clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: 'Network error occurred'
        }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  public async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = params 
      ? `${endpoint}?${new URLSearchParams(params)}` 
      : endpoint;
    
    return this.request<T>(url, { method: 'GET' });
  }

  // POST request
  public async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  public async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  public async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Upload file (multipart/form-data)
  public async uploadFile<T>(endpoint: string, formData: FormData, onProgress?: (progress: number) => void): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      // Use XMLHttpRequest for progress tracking if callback provided
      if (onProgress) {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              onProgress(progress);
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
              } catch (error) {
                reject(new Error('Invalid JSON response'));
              }
            } else {
              try {
                const errorData = JSON.parse(xhr.responseText);
                reject(new Error(errorData.error || `Upload failed! status: ${xhr.status}`));
              } catch (error) {
                reject(new Error(`Upload failed! status: ${xhr.status}`));
              }
            }
          });

          xhr.addEventListener('error', () => {
            reject(new Error('Upload failed due to network error'));
          });

          xhr.open('POST', url);
          
          // Set headers
          if (this.token) {
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
          }

          xhr.send(formData);
        });
      }

      // Fallback to fetch API without progress
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: 'Upload failed'
        }));
        throw new Error(errorData.error || `Upload failed! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Utility function to handle API errors
export const handleApiError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};