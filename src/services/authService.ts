import { User } from './apiClient';

// Authentication service
export interface LoginRequest {
  emailOrUsername: string;
  password: string;
  deviceId?: string;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
  platform?: 'ios' | 'android' | 'web';
  pushToken?: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  displayName?: string;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
  platform?: 'ios' | 'android' | 'web';
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  expiresIn: string;
}

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: 'demo-user-1',
    email: 'demo@streamvault.com',
    password: 'demo123456',
    username: 'DemoUser',
    displayName: 'Demo User',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Demo%20User&backgroundColor=6366f1',
    bio: 'Welcome to StreamVault! This is a demo account for testing.',
    website: 'https://streamvault.com',
    location: 'Demo City',
    isVerified: true,
    isCreator: true,
    emailVerified: true,
    subscriberCount: 12500,
    videoCount: 23,
    totalViews: 450000,
    privacy: 'PUBLIC' as const,
    preferences: {},
    createdAt: '2024-01-01T00:00:00.000Z',
    channels: [{
      id: 'demo-channel-1',
      name: 'Demo Channel',
      handle: 'demochannel',
      profilePicture: 'https://api.dicebear.com/7.x/initials/svg?seed=Demo%20Channel&backgroundColor=6366f1',
      bannerImage: 'https://picsum.photos/1200/300?random=1',
      subscriberCount: 12500,
      isVerified: true,
      description: 'Welcome to our demo channel!',
      category: 'Education',
      country: 'US',
      language: 'en',
      monetizationEnabled: true
    }]
  },
  {
    id: 'test-user-1',
    email: 'test@streamvault.com',
    password: 'test123456',
    username: 'TestUser',
    displayName: 'Test User',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Test%20User&backgroundColor=f59e0b',
    bio: 'Test account for StreamVault platform.',
    isVerified: false,
    isCreator: true,
    emailVerified: true,
    subscriberCount: 890,
    videoCount: 5,
    totalViews: 15000,
    privacy: 'PUBLIC' as const,
    preferences: {},
    createdAt: '2024-02-01T00:00:00.000Z',
    channels: [{
      id: 'test-channel-1',
      name: 'Test Channel',
      handle: 'testchannel',
      profilePicture: 'https://api.dicebear.com/7.x/initials/svg?seed=Test%20Channel&backgroundColor=f59e0b',
      bannerImage: 'https://picsum.photos/1200/300?random=2',
      subscriberCount: 890,
      isVerified: false,
      description: 'Test channel for development.',
      category: 'Technology',
      country: 'US',
      language: 'en',
      monetizationEnabled: false
    }]
  },
  {
    id: 'admin-user-1',
    email: 'admin@streamvault.com',
    password: 'admin123456',
    username: 'AdminUser',
    displayName: 'Admin User',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin%20User&backgroundColor=ef4444',
    bio: 'Administrator account.',
    isVerified: true,
    isCreator: false,
    emailVerified: true,
    subscriberCount: 0,
    videoCount: 0,
    totalViews: 0,
    privacy: 'PRIVATE' as const,
    preferences: {},
    createdAt: '2023-12-01T00:00:00.000Z',
    channels: []
  }
];

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Find user by email or username
      const user = MOCK_USERS.find(u => 
        u.email === credentials.emailOrUsername || 
        u.username === credentials.emailOrUsername
      );

      if (!user) {
        throw new Error('User not found');
      }

      if (user.password !== credentials.password) {
        throw new Error('Invalid password');
      }

      // Create mock response
      const mockToken = `mock-jwt-token-${user.id}-${Date.now()}`;
      const response: AuthResponse = {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          bio: user.bio,
          website: user.website,
          location: user.location,
          isVerified: user.isVerified,
          isCreator: user.isCreator,
          emailVerified: user.emailVerified,
          subscriberCount: user.subscriberCount,
          videoCount: user.videoCount,
          totalViews: user.totalViews,
          privacy: user.privacy,
          preferences: user.preferences,
          createdAt: user.createdAt,
          channels: user.channels
        },
        token: mockToken,
        expiresIn: '24h'
      };

      // Store token and user data
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => 
        u.email === userData.email || u.username === userData.username
      );

      if (existingUser) {
        throw new Error('User already exists with this email or username');
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email: userData.email,
        password: userData.password,
        username: userData.username,
        displayName: userData.displayName || userData.username,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.displayName || userData.username)}&backgroundColor=6366f1`,
        bio: '',
        isVerified: false,
        isCreator: false,
        emailVerified: false,
        subscriberCount: 0,
        videoCount: 0,
        totalViews: 0,
        privacy: 'PUBLIC' as const,
        preferences: {},
        createdAt: new Date().toISOString(),
        channels: []
      };

      // Add to mock users (in a real app, this would be saved to database)
      MOCK_USERS.push(newUser);

      // Create mock response
      const mockToken = `mock-jwt-token-${newUser.id}-${Date.now()}`;
      const response: AuthResponse = {
        message: 'Registration successful',
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          displayName: newUser.displayName,
          avatar: newUser.avatar,
          bio: newUser.bio,
          isVerified: newUser.isVerified,
          isCreator: newUser.isCreator,
          emailVerified: newUser.emailVerified,
          subscriberCount: newUser.subscriberCount,
          videoCount: newUser.videoCount,
          totalViews: newUser.totalViews,
          privacy: newUser.privacy,
          preferences: newUser.preferences,
          createdAt: newUser.createdAt,
          channels: newUser.channels
        },
        token: mockToken,
        expiresIn: '24h'
      };

      // Store token and user data
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  async getCurrentUser(): Promise<{ user: User }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      const currentUser = this.getCurrentUserFromStorage();
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }
      
      return { user: currentUser };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get current user');
    }
  }

  async logout(deviceId?: string): Promise<void> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // In a real app, we would notify the server about logout
      console.log('Logging out user', { deviceId });
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      // Always clear local data
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
  }

  // Check if user is currently authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    return !!(token && user);
  }

  // Get current user from localStorage
  getCurrentUserFromStorage(): User | null {
    try {
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // Refresh user data from server
  async refreshUserData(): Promise<User> {
    try {
      const response = await this.getCurrentUser();
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      return response.user;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to refresh user data');
    }
  }
}

export const authService = new AuthService();