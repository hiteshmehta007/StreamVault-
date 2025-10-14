# Video Streaming Platform Backend

A robust, scalable backend for a video streaming platform supporting both web and mobile applications.

## 🚀 Features

### Core Features
- **Multi-platform Support**: Web and mobile (iOS/Android) optimized
- **Video Processing**: Automatic transcoding to multiple qualities
- **Real-time Features**: Live streaming, real-time comments, notifications
- **Analytics**: Comprehensive tracking and reporting
- **Security**: JWT authentication, rate limiting, input validation

### Technical Features
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis for session management and caching
- **File Storage**: Cloudinary for media assets
- **Background Jobs**: Bull queue for video processing
- **Real-time**: Socket.IO for live features
- **Monitoring**: Winston logging and health checks

## 📱 Mobile & Web Support

### Mobile Features
- Device registration and management
- Push notifications
- Offline video download capabilities
- Mobile-optimized API responses
- Platform-specific authentication

### Web Features
- Full-featured web application support
- Real-time updates
- Advanced analytics dashboard
- Admin panel capabilities

## 🏗️ Architecture

```
backend/
├── src/
│   ├── controllers/      # API controllers
│   ├── services/         # Business logic
│   ├── models/           # Database models
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration
│   ├── jobs/             # Background jobs
│   └── types/            # TypeScript types
├── prisma/               # Database schema
├── tests/                # Test files
└── uploads/              # Temporary storage
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- FFmpeg (for video processing)

### Installation

1. **Clone and install dependencies:**
```bash
cd backend
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Set up database:**
```bash
npm run db:migrate
npm run db:seed
```

4. **Start development server:**
```bash
npm run dev
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Videos
- `GET /api/videos` - List videos
- `POST /api/videos` - Upload video
- `GET /api/videos/:id` - Get video details
- `POST /api/videos/:id/like` - Like/unlike video

### Mobile Specific
- `GET /api/mobile/feed` - Mobile optimized feed
- `GET /api/mobile/video/:id/play` - Mobile video playback
- `POST /api/mobile/video/:id/progress` - Update watch progress

### Live Streaming
- `POST /api/live/start` - Start live stream
- `POST /api/live/stop` - Stop live stream
- `GET /api/live/streams` - List live streams

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/videostream"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# URLs
WEB_URL="http://localhost:3000"
MOBILE_SCHEME="videostream://"

# File Upload
MAX_FILE_SIZE=2147483648  # 2GB
UPLOAD_PATH="./uploads"

# Server
PORT=5000
NODE_ENV="development"
```

## 📱 Mobile Integration

### iOS Integration
```swift
// Configure base URL
let baseURL = "http://localhost:5000/api"

// Login example
func loginUser(email: String, password: String) {
    let loginData = [
        "emailOrUsername": email,
        "password": password,
        "deviceType": "mobile",
        "platform": "ios",
        "deviceId": UIDevice.current.identifierForVendor?.uuidString
    ]
    
    // Make API call...
}
```

### Android Integration
```kotlin
// Configure base URL
const val BASE_URL = "http://localhost:5000/api"

// Login example
data class LoginRequest(
    val emailOrUsername: String,
    val password: String,
    val deviceType: String = "mobile",
    val platform: String = "android",
    val deviceId: String = Settings.Secure.getString(contentResolver, Settings.Secure.ANDROID_ID)
)
```

## 🔐 Security Features

- **Authentication**: JWT with refresh tokens
- **Rate Limiting**: Configurable per endpoint
- **Input Validation**: Zod schemas for all inputs
- **CORS**: Configurable cross-origin support
- **Helmet**: Security headers
- **Password Hashing**: bcryptjs with salt rounds

## 📈 Monitoring & Analytics

### Health Check
```bash
curl http://localhost:5000/health
```

### Logs
- Application logs in `logs/` directory
- Structured JSON logging with Winston
- Error tracking and performance monitoring

## 🐳 Docker Support

```dockerfile
# Build
docker build -t video-streaming-backend .

# Run
docker run -p 5000:5000 video-streaming-backend
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## 📚 API Documentation

Full API documentation is available at `/api/docs` when running in development mode.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.