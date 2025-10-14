# 🚀 Video Streaming Platform Backend - Setup Guide

## Prerequisites

Before setting up the backend, ensure you have the following installed:

### Required Software
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Redis** 6+ ([Download](https://redis.io/download))
- **FFmpeg** ([Download](https://ffmpeg.org/download.html))

### Optional (for production)
- **Docker** & **Docker Compose** ([Download](https://www.docker.com/))

## 🛠️ Installation Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/videostream"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT (Change this!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Email (Gmail example)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"  # Use App Password for Gmail

# URLs
WEB_URL="http://localhost:3001"  # Your frontend URL

# File Storage (Optional - Cloudinary)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE videostream;
CREATE USER videostream_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE videostream TO videostream_user;
```

Run database migrations:

```bash
npx prisma migrate dev
```

Generate Prisma client:

```bash
npx prisma generate
```

### 4. Start Services

#### Option A: Manual Setup

Start PostgreSQL and Redis manually, then:

```bash
npm run dev
```

#### Option B: Docker Compose (Recommended)

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Redis cache
- Backend API server

## 📱 Mobile App Integration

### iOS Integration

1. **Base URL Configuration**:
```swift
let baseURL = "http://localhost:5000/api"
// For production: "https://your-domain.com/api"
```

2. **Authentication Example**:
```swift
struct LoginRequest: Codable {
    let emailOrUsername: String
    let password: String
    let deviceType: String = "mobile"
    let platform: String = "ios"
    let deviceId: String
    let pushToken: String?
}

func loginUser(request: LoginRequest) async throws -> LoginResponse {
    let url = URL(string: "\(baseURL)/auth/login")!
    var urlRequest = URLRequest(url: url)
    urlRequest.httpMethod = "POST"
    urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
    urlRequest.httpBody = try JSONEncoder().encode(request)
    
    let (data, _) = try await URLSession.shared.data(for: urlRequest)
    return try JSONDecoder().decode(LoginResponse.self, from: data)
}
```

### Android Integration

1. **Base URL Configuration**:
```kotlin
object ApiConfig {
    const val BASE_URL = "http://10.0.2.2:5000/api" // For emulator
    // For production: "https://your-domain.com/api"
}
```

2. **Authentication Example**:
```kotlin
data class LoginRequest(
    val emailOrUsername: String,
    val password: String,
    val deviceType: String = "mobile",
    val platform: String = "android",
    val deviceId: String = Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID),
    val pushToken: String? = null
)

class AuthService {
    private val retrofit = Retrofit.Builder()
        .baseUrl(ApiConfig.BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    private val api = retrofit.create(AuthApi::class.java)
    
    suspend fun login(request: LoginRequest): LoginResponse {
        return api.login(request)
    }
}
```

## 🔧 Configuration Details

### JWT Configuration
- **Development**: 7 days for web, 30 days for mobile
- **Production**: Use a strong, unique secret key
- **Security**: Store tokens securely (iOS Keychain, Android Keystore)

### File Upload Limits
- **Max file size**: 2GB
- **Supported formats**: MP4, AVI, MOV, MKV
- **Processing**: Automatic transcoding to multiple qualities

### Video Processing
- **Qualities**: 360p, 480p, 720p, 1080p, 1440p, 2160p
- **Formats**: H.264/AAC in MP4 container
- **Storage**: Local filesystem or Cloudinary

### Push Notifications
Configure Firebase Cloud Messaging (FCM) for mobile push notifications:

1. Add FCM configuration to your mobile apps
2. Update device tokens via `/api/auth/login` endpoint
3. Notifications are sent automatically for:
   - New subscribers
   - New comments on your videos
   - Live stream notifications

## 🚀 Production Deployment

### Docker Deployment

1. **Build and deploy**:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

2. **Environment variables for production**:
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@db:5432/videostream
REDIS_URL=redis://redis:6379
JWT_SECRET=your-super-secure-production-secret
WEB_URL=https://your-domain.com
```

### Manual Deployment

1. **Build the application**:
```bash
npm run build
```

2. **Start with PM2**:
```bash
npm install -g pm2
pm2 start dist/server.js --name video-streaming-backend
```

### Database Migrations in Production

```bash
npx prisma migrate deploy
```

## 📊 Monitoring & Maintenance

### Health Checks
- **Endpoint**: `GET /health`
- **Response**: Server status, uptime, environment info

### Logging
- **Location**: `./logs/` directory
- **Files**: `combined.log`, `error.log`
- **Format**: JSON with timestamps

### Analytics
- **Real-time**: Video views, user interactions
- **Daily aggregation**: View counts, watch time, demographics
- **API**: `/api/analytics/*` endpoints

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Platform-specific token expiry
- Device registration and management
- Optional email verification

### Rate Limiting
- **General API**: 100 requests per 15 minutes
- **Upload API**: 10 uploads per hour
- **Auth API**: 5 attempts per 15 minutes

### Input Validation
- Zod schema validation
- SQL injection prevention (Prisma ORM)
- File upload validation
- CORS configuration

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**:
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Check connection string format
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

2. **Redis Connection**:
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG
```

3. **FFmpeg Not Found**:
```bash
# Install FFmpeg
# Windows: Download from https://ffmpeg.org/
# macOS: brew install ffmpeg
# Ubuntu: sudo apt install ffmpeg
```

4. **Port Already in Use**:
```bash
# Check what's using port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # macOS/Linux

# Change port in .env file
PORT=5001
```

### Development Tips

1. **Database GUI**: Use Prisma Studio
```bash
npx prisma studio
```

2. **API Testing**: Use the built-in endpoints
```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/mobile/version
```

3. **Log Monitoring**:
```bash
tail -f logs/combined.log
```

## 📚 API Documentation

Once the server is running, comprehensive API documentation is available at:
- **Development**: `http://localhost:5000/api/docs`
- **Production**: `https://your-domain.com/api/docs`

## 🤝 Support

For issues and questions:
1. Check the logs in `./logs/` directory
2. Verify all environment variables are set correctly
3. Ensure all required services (PostgreSQL, Redis) are running
4. Check that all dependencies are installed (`npm install`)

---

## Next Steps

After setting up the backend:

1. **Frontend Integration**: Update your React frontend to use the API endpoints
2. **Mobile Development**: Integrate the API into your iOS/Android apps
3. **Testing**: Run the test suite with `npm test`
4. **Production**: Deploy using Docker or your preferred hosting platform

Your video streaming platform backend is now ready to support both web and mobile applications! 🎉