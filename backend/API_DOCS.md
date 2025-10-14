# 📚 Video Streaming Platform API Documentation

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Authentication Flow

#### Web Applications
```javascript
// Login request
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    emailOrUsername: 'user@example.com',
    password: 'password123',
    platform: 'web'
  })
});

const { token, user } = await response.json();
```

#### Mobile Applications
```javascript
// Mobile login with device registration
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    emailOrUsername: 'user@example.com',
    password: 'password123',
    deviceId: 'unique-device-id',
    deviceType: 'mobile',
    platform: 'ios', // or 'android'
    pushToken: 'firebase-push-token'
  })
});
```

---

## 🔐 Authentication Endpoints

### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123",
  "displayName": "John Doe",
  "deviceType": "mobile",
  "platform": "ios"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "clp123456",
    "email": "user@example.com",
    "username": "johndoe",
    "displayName": "John Doe",
    "isVerified": false,
    "isCreator": false
  },
  "token": "jwt_token_here",
  "expiresIn": "30d"
}
```

### POST `/auth/login`
Authenticate user and get access token.

**Request Body:**
```json
{
  "emailOrUsername": "user@example.com",
  "password": "securepassword123",
  "deviceId": "device-uuid",
  "deviceType": "mobile",
  "platform": "ios",
  "pushToken": "firebase-token"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "clp123456",
    "email": "user@example.com",
    "username": "johndoe",
    "displayName": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "isVerified": true,
    "isCreator": false
  },
  "token": "jwt_token_here",
  "expiresIn": "7d"
}
```

### GET `/auth/me` 🔒
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "clp123456",
    "email": "user@example.com",
    "username": "johndoe",
    "displayName": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Content creator and tech enthusiast",
    "isVerified": true,
    "isCreator": true,
    "subscriberCount": 15420,
    "videoCount": 87,
    "totalViews": 2450000,
    "channels": [
      {
        "id": "ch_123",
        "name": "Tech Reviews",
        "handle": "@techreviews",
        "subscriberCount": 15420,
        "isVerified": true
      }
    ]
  }
}
```

---

## 📱 Mobile-Specific Endpoints

### GET `/mobile/version`
Get mobile app version and feature information.

**Response:**
```json
{
  "minVersion": "1.0.0",
  "latestVersion": "1.2.0",
  "updateRequired": false,
  "updateUrl": {
    "ios": "https://apps.apple.com/app/your-app",
    "android": "https://play.google.com/store/apps/details?id=your.app"
  },
  "features": {
    "liveStreaming": true,
    "offlineDownload": true,
    "pushNotifications": true,
    "backgroundPlay": true
  },
  "apiVersion": "1.0"
}
```

### GET `/mobile/feed`
Get mobile-optimized video feed.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Videos per page (max: 50, default: 20)
- `category` (optional): Filter by category
- `quality` (optional): Preferred video quality (360p, 720p, 1080p)

**Response:**
```json
{
  "videos": [
    {
      "id": "vid_123",
      "title": "Amazing Tech Review",
      "description": "Latest smartphone review...",
      "thumbnail": "https://example.com/thumb.jpg",
      "duration": 720,
      "viewCount": 45230,
      "likeCount": 1250,
      "createdAt": "2024-01-15T10:30:00Z",
      "creator": {
        "id": "user_123",
        "username": "techreviewer",
        "displayName": "Tech Reviewer",
        "avatar": "https://example.com/avatar.jpg",
        "isVerified": true
      },
      "qualityVersions": [
        {
          "quality": "720p",
          "url": "https://example.com/video_720p.mp4",
          "fileSize": 45000000
        }
      ],
      "userInteraction": {
        "isLiked": false,
        "isDisliked": false,
        "isInWatchLater": true,
        "isSubscribed": true
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "hasMore": true
  }
}
```

### GET `/mobile/video/:videoId/play`
Get video playback information for mobile.

**Path Parameters:**
- `videoId`: Video ID

**Query Parameters:**
- `quality` (optional): Preferred quality (default: 720p)

**Response:**
```json
{
  "video": {
    "id": "vid_123",
    "title": "Amazing Tech Review",
    "description": "Detailed review of the latest smartphone...",
    "thumbnail": "https://example.com/thumb.jpg",
    "videoUrl": "https://example.com/video_720p.mp4",
    "duration": 720,
    "viewCount": 45231,
    "likeCount": 1251,
    "dislikeCount": 15,
    "commentCount": 89,
    "createdAt": "2024-01-15T10:30:00Z",
    "creator": {
      "id": "user_123",
      "username": "techreviewer",
      "displayName": "Tech Reviewer",
      "avatar": "https://example.com/avatar.jpg",
      "isVerified": true,
      "subscriberCount": 15420
    },
    "qualityVersions": [
      {
        "quality": "1080p",
        "url": "https://example.com/video_1080p.mp4",
        "fileSize": 120000000
      },
      {
        "quality": "720p",
        "url": "https://example.com/video_720p.mp4",
        "fileSize": 45000000
      }
    ]
  },
  "userInteraction": {
    "isLiked": false,
    "isDisliked": false,
    "isInWatchLater": true,
    "isSubscribed": true,
    "resumeTime": 180
  }
}
```

### POST `/mobile/video/:videoId/progress` 🔒
Update video watch progress for mobile users.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "watchTime": 450,
  "duration": 720,
  "completed": false
}
```

**Response:**
```json
{
  "message": "Progress updated successfully"
}
```

---

## 🎥 Video Endpoints

### GET `/videos`
Get list of videos with filtering and pagination.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Videos per page
- `category` (optional): Filter by category
- `creatorId` (optional): Filter by creator
- `sort` (optional): Sort order (newest, popular, trending)

**Response:**
```json
{
  "videos": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1250,
    "hasMore": true
  }
}
```

### GET `/videos/:videoId`
Get detailed video information.

**Response:**
```json
{
  "video": {
    "id": "vid_123",
    "title": "Amazing Tech Review",
    "description": "Detailed description...",
    "thumbnail": "https://example.com/thumb.jpg",
    "videoUrl": "https://example.com/video.mp4",
    "duration": 720,
    "viewCount": 45230,
    "likeCount": 1250,
    "dislikeCount": 15,
    "commentCount": 89,
    "tags": ["tech", "review", "smartphone"],
    "category": "Technology",
    "createdAt": "2024-01-15T10:30:00Z",
    "creator": {
      "id": "user_123",
      "username": "techreviewer",
      "displayName": "Tech Reviewer",
      "avatar": "https://example.com/avatar.jpg",
      "isVerified": true,
      "subscriberCount": 15420
    }
  }
}
```

### POST `/videos/:videoId/like` 🔒
Like or dislike a video.

**Request Body:**
```json
{
  "type": "LIKE"  // or "DISLIKE"
}
```

**Response:**
```json
{
  "message": "Video liked successfully",
  "likeCount": 1251,
  "dislikeCount": 15,
  "userLikeType": "LIKE"
}
```

---

## 👥 User & Channel Endpoints

### GET `/users/:userId`
Get public user profile information.

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "username": "techreviewer",
    "displayName": "Tech Reviewer",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Tech enthusiast and content creator",
    "isVerified": true,
    "isCreator": true,
    "subscriberCount": 15420,
    "videoCount": 87,
    "totalViews": 2450000,
    "joinedAt": "2023-06-15T09:00:00Z"
  }
}
```

### POST `/users/:userId/subscribe` 🔒
Subscribe or unsubscribe from a user/channel.

**Request Body:**
```json
{
  "action": "SUBSCRIBE"  // or "UNSUBSCRIBE"
}
```

**Response:**
```json
{
  "message": "Subscribed successfully",
  "isSubscribed": true,
  "subscriberCount": 15421
}
```

---

## 💬 Comments Endpoints

### GET `/videos/:videoId/comments`
Get comments for a video.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Comments per page
- `sort` (optional): Sort order (newest, oldest, popular)

**Response:**
```json
{
  "comments": [
    {
      "id": "comment_123",
      "content": "Great review! Very helpful.",
      "likeCount": 12,
      "isEdited": false,
      "isPinned": false,
      "createdAt": "2024-01-15T11:45:00Z",
      "author": {
        "id": "user_456",
        "username": "viewer123",
        "displayName": "John Viewer",
        "avatar": "https://example.com/avatar2.jpg",
        "isVerified": false
      },
      "replies": []
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "hasMore": true
  }
}
```

### POST `/videos/:videoId/comments` 🔒
Add a comment to a video.

**Request Body:**
```json
{
  "content": "Great video! Thanks for sharing.",
  "parentId": null  // For replies, provide parent comment ID
}
```

**Response:**
```json
{
  "comment": {
    "id": "comment_124",
    "content": "Great video! Thanks for sharing.",
    "likeCount": 0,
    "createdAt": "2024-01-15T12:00:00Z",
    "author": {
      "id": "user_789",
      "username": "currentuser",
      "displayName": "Current User",
      "avatar": "https://example.com/my-avatar.jpg"
    }
  }
}
```

---

## 📊 Analytics Endpoints

### GET `/analytics/video/:videoId` 🔒
Get analytics for a specific video (creator only).

**Query Parameters:**
- `days` (optional): Number of days to include (default: 30)

**Response:**
```json
{
  "dailyAnalytics": [
    {
      "date": "2024-01-15T00:00:00Z",
      "views": 450,
      "likes": 23,
      "comments": 8,
      "watchTime": 12600,
      "mobileViews": 280,
      "desktopViews": 170
    }
  ],
  "summary": {
    "totalViews": 45230,
    "totalWatchTime": 580500,
    "totalLikes": 1250,
    "totalComments": 89,
    "mobileViews": 28500,
    "desktopViews": 16730
  },
  "period": {
    "startDate": "2023-12-16T00:00:00Z",
    "endDate": "2024-01-15T00:00:00Z",
    "days": 30
  }
}
```

### GET `/analytics/user` 🔒
Get analytics for current user (creator analytics).

**Response:**
```json
{
  "summary": {
    "totalVideoViews": 2450000,
    "totalSubscribers": 15420,
    "totalWatchTime": 8760000,
    "totalRevenue": 1250.50
  },
  "recentPerformance": {
    "last7Days": {
      "views": 125000,
      "subscribers": 145,
      "watchTime": 420000
    },
    "last30Days": {
      "views": 580000,
      "subscribers": 620,
      "watchTime": 1890000
    }
  },
  "topVideos": [
    {
      "id": "vid_123",
      "title": "Amazing Tech Review",
      "views": 45230,
      "performance": "+15.2%"
    }
  ]
}
```

---

## 🔍 Search Endpoints

### GET `/search`
Search for videos, users, and channels.

**Query Parameters:**
- `q`: Search query (required)
- `type`: Search type (video, user, channel, all)
- `page`: Page number
- `limit`: Results per page

**Response:**
```json
{
  "results": {
    "videos": [...],
    "users": [...],
    "channels": [...]
  },
  "query": "tech review",
  "totalResults": 1250,
  "pagination": {
    "page": 1,
    "limit": 20,
    "hasMore": true
  }
}
```

---

## 🔴 Live Streaming Endpoints

### GET `/live/streams`
Get list of active live streams.

**Response:**
```json
{
  "streams": [
    {
      "id": "stream_123",
      "title": "Live Tech Discussion",
      "description": "Discussing latest tech trends",
      "status": "LIVE",
      "viewerCount": 245,
      "startedAt": "2024-01-15T14:00:00Z",
      "streamer": {
        "id": "user_123",
        "username": "techstreamer",
        "displayName": "Tech Streamer",
        "avatar": "https://example.com/avatar.jpg",
        "isVerified": true
      }
    }
  ]
}
```

### POST `/live/start` 🔒
Start a live stream (creator only).

**Request Body:**
```json
{
  "title": "Live Tech Discussion",
  "description": "Discussing latest tech trends",
  "scheduledAt": "2024-01-15T14:00:00Z"
}
```

**Response:**
```json
{
  "stream": {
    "id": "stream_124",
    "title": "Live Tech Discussion",
    "streamKey": "live_key_abc123",
    "streamUrl": "rtmp://streaming-server.com/live",
    "status": "SCHEDULED"
  }
}
```

---

## 🔔 Notification Endpoints

### GET `/notifications` 🔒
Get user notifications.

**Query Parameters:**
- `page` (optional): Page number
- `unread` (optional): Filter by unread status

**Response:**
```json
{
  "notifications": [
    {
      "id": "notif_123",
      "type": "NEW_SUBSCRIBER",
      "title": "New Subscriber!",
      "message": "John Doe subscribed to your channel",
      "isRead": false,
      "createdAt": "2024-01-15T13:30:00Z",
      "data": {
        "subscriberId": "user_456",
        "subscriberName": "John Doe"
      }
    }
  ],
  "unreadCount": 5
}
```

### POST `/notifications/mark-read` 🔒
Mark notifications as read.

**Request Body:**
```json
{
  "notificationIds": ["notif_123", "notif_124"]
}
```

---

## 📤 Upload Endpoints

### POST `/upload/video` 🔒
Upload a video file.

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Form Data:**
- `video`: Video file (required)
- `title`: Video title (required)
- `description`: Video description
- `category`: Video category
- `tags`: Comma-separated tags
- `visibility`: PUBLIC, UNLISTED, or PRIVATE

**Response:**
```json
{
  "video": {
    "id": "vid_125",
    "title": "My New Video",
    "status": "PROCESSING",
    "processingProgress": 0,
    "uploadedAt": "2024-01-15T15:00:00Z"
  },
  "message": "Video uploaded successfully. Processing started."
}
```

---

## ⚠️ Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format",
      "code": "invalid_string"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 📡 WebSocket Events

### Connection
```javascript
const socket = io('ws://localhost:5000', {
  auth: {
    token: 'jwt_token_here'
  }
});
```

### Video Watching Events
```javascript
// Join video room
socket.emit('watch-video', { videoId: 'vid_123' });

// Leave video room
socket.emit('leave-video', { videoId: 'vid_123' });

// Listen for new viewers
socket.on('viewer-joined', (data) => {
  console.log('New viewer joined:', data);
});
```

### Live Stream Events
```javascript
// Join live stream
socket.emit('join-live-stream', { streamId: 'stream_123' });

// Listen for viewer count updates
socket.on('viewer-joined-stream', (data) => {
  console.log('Current viewers:', data.viewerCount);
});
```

### Real-time Comments
```javascript
// Send new comment
socket.emit('new-comment', {
  videoId: 'vid_123',
  comment: { /* comment object */ }
});

// Listen for new comments
socket.on('comment-added', (comment) => {
  console.log('New comment:', comment);
});
```

---

## 🚀 Rate Limits

- **General API**: 100 requests per 15 minutes
- **Upload API**: 10 uploads per hour
- **Auth API**: 5 login attempts per 15 minutes
- **Search API**: 30 requests per minute

## 🔐 Security Headers

All API responses include security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HTTPS only)

---

*This API documentation is automatically updated. For the most current version, visit `/api/docs` when the server is running.*