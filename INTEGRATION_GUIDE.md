# Frontend-Backend Integration Guide

## Overview
This video streaming platform now includes both a React frontend and a Node.js backend that work together to provide a complete video streaming experience.

## Architecture Components

### Frontend (React/TypeScript)
- **Location**: `src/` directory
- **Framework**: React 18 with TypeScript, Vite build tool
- **UI Library**: shadcn/ui components with Tailwind CSS
- **Key Features**: Video player, user authentication, responsive design

### Backend (Node.js/Express)
- **Location**: `backend/` directory
- **Framework**: Node.js with Express and TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Features**: RESTful APIs, JWT authentication, video processing, real-time features

## API Integration

### Authentication Service
```typescript
import { authService } from './services/authService';

// Login
await authService.login({
  emailOrUsername: 'user@example.com',
  password: 'password',
  platform: 'web',
  deviceType: 'desktop'
});

// Register
await authService.register({
  email: 'user@example.com',
  username: 'username',
  password: 'password',
  displayName: 'Display Name',
  platform: 'web'
});
```

### Video Service
```typescript
import { videoService } from './services/videoService';

// Get video feed
const feed = await videoService.getVideosFeed({
  page: 1,
  limit: 20,
  category: 'technology'
});

// Upload video
await videoService.uploadVideo(formData, {
  title: 'Video Title',
  description: 'Video Description',
  category: 'technology'
});
```

### User Service
```typescript
import { userService } from './services/userService';

// Get user profile
const profile = await userService.getProfile('user-id');

// Subscribe to channel
await userService.subscribeToChannel('channel-id');
```

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for caching)

### Running the Application

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Create `.env` files in both root and backend directories:
   
   **Root `.env`:**
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
   
   **Backend `.env`:**
   ```
   NODE_ENV=development
   PORT=5000
   DATABASE_URL="postgresql://username:password@localhost:5432/streaming_platform"
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRES_IN=7d
   REDIS_URL=redis://localhost:6379
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

3. **Set up Database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

4. **Start Development Servers**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Videos
- `GET /api/videos` - Get video feed
- `POST /api/videos/upload` - Upload video
- `GET /api/videos/:id` - Get video details
- `POST /api/videos/:id/like` - Like/unlike video
- `GET /api/videos/:id/analytics` - Get video analytics

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/subscribe` - Subscribe to user
- `GET /api/users/:id/subscriptions` - Get user subscriptions

### Mobile Support
- `GET /api/mobile/feed` - Mobile-optimized video feed
- `POST /api/mobile/auth/register` - Mobile user registration
- `GET /api/mobile/users/:id` - Mobile user profile

## Features

### Authentication
- JWT-based authentication with refresh tokens
- Device detection and platform-specific responses
- Social login support (ready for integration)

### Video Management
- Video upload with multiple quality transcoding
- Real-time view tracking and analytics
- Comment system with real-time updates
- Like/dislike functionality

### User Experience
- Responsive design for all screen sizes
- Progressive Web App (PWA) ready
- Offline support for cached content
- Real-time notifications

### Performance
- Video streaming with adaptive bitrate
- CDN integration for global content delivery
- Redis caching for improved response times
- Database optimization with proper indexing

## Error Handling

The frontend automatically falls back to mock data if the backend is unavailable:

```typescript
try {
  const data = await videoService.getVideosFeed();
  // Use backend data
} catch (error) {
  console.warn('Backend not available, using mock data:', error);
  // Use local mock data
}
```

## Deployment

### Production Environment Variables
Update API URLs for production:
- Frontend: Set `VITE_API_URL` to your production API URL
- Backend: Configure production database and Redis URLs

### Docker Support
Use the provided Dockerfile and docker-compose.yml for containerized deployment.

## Testing

### Frontend Testing
```bash
npm run test
```

### Backend Testing
```bash
cd backend
npm run test
```

## Contributing

1. Follow TypeScript strict mode guidelines
2. Use Prettier for code formatting
3. Write unit tests for new features
4. Update API documentation when adding endpoints

## Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Check if backend server is running on port 5000
   - Verify environment variables are set correctly
   - Check database connection

2. **Authentication Issues**
   - Verify JWT_SECRET is set in backend
   - Check token expiration settings
   - Clear localStorage if needed

3. **Video Upload Failures**
   - Check file size limits
   - Verify Cloudinary credentials
   - Check available disk space

For more detailed troubleshooting, check the console logs in both frontend and backend applications.