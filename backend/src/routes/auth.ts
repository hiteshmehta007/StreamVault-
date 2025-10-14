import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../server';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { logger } from '../utils/logger';

const router = express.Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8),
  displayName: z.string().min(1).max(100).optional(),
  deviceType: z.enum(['mobile', 'desktop', 'tablet']).optional(),
  platform: z.enum(['ios', 'android', 'web']).optional()
});

const loginSchema = z.object({
  emailOrUsername: z.string().min(1),
  password: z.string().min(1),
  deviceId: z.string().optional(),
  deviceType: z.enum(['mobile', 'desktop', 'tablet']).optional(),
  platform: z.enum(['ios', 'android', 'web']).optional(),
  pushToken: z.string().optional()
});

// Generate verification token
const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Register
router.post('/register', validateRequest(registerSchema), async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, username, password, displayName, deviceType, platform } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(409).json({ 
        error: existingUser.email === email ? 'Email already registered' : 'Username already taken' 
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    const emailVerifyToken = generateVerificationToken();

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        displayName: displayName || username,
        passwordHash,
        emailVerifyToken
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatar: true,
        isVerified: true,
        isCreator: true,
        emailVerified: true,
        createdAt: true
      }
    });

    // Register device if mobile
    if (deviceType && platform) {
      await prisma.device.create({
        data: {
          userId: user.id,
          deviceId: req.body.deviceId || `${platform}-${Date.now()}`,
          deviceType,
          platform,
          pushToken: req.body.pushToken
        }
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        platform: platform || 'web'
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' } // Longer expiry for mobile
    );

    logger.info(`New user registered: ${username} from ${platform || 'web'}`);

    return res.status(201).json({
      message: 'User registered successfully. Please check your email for verification.',
      user,
      token,
      expiresIn: '30d'
    });
  } catch (error) {
    logger.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', validateRequest(loginSchema), async (req: Request, res: Response): Promise<Response> => {
  try {
    const { emailOrUsername, password, deviceId, deviceType, platform, pushToken } = req.body;

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      }
    });

    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Handle device registration/update for mobile
    if (deviceId && deviceType && platform) {
      await prisma.device.upsert({
        where: {
          userId_deviceId: {
            userId: user.id,
            deviceId
          }
        },
        create: {
          userId: user.id,
          deviceId,
          deviceType,
          platform,
          pushToken,
          lastUsedAt: new Date()
        },
        update: {
          pushToken,
          lastUsedAt: new Date(),
          isActive: true
        }
      });
    }

    // Generate JWT with platform info
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        platform: platform || 'web'
      },
      process.env.JWT_SECRET!,
      { expiresIn: platform === 'web' ? '7d' : '30d' }
    );

    const userResponse = {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      isVerified: user.isVerified,
      isCreator: user.isCreator,
      emailVerified: user.emailVerified
    };

    logger.info(`User logged in: ${user.username} from ${platform || 'web'}`);

    return res.json({
      message: 'Login successful',
      user: userResponse,
      token,
      expiresIn: platform === 'web' ? '7d' : '30d'
    });
  } catch (error) {
    logger.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req: any, res: Response): Promise<Response> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatar: true,
        bio: true,
        website: true,
        location: true,
        isVerified: true,
        isCreator: true,
        emailVerified: true,
        subscriberCount: true,
        videoCount: true,
        totalViews: true,
        privacy: true,
        preferences: true,
        createdAt: true,
        channels: {
          select: {
            id: true,
            name: true,
            handle: true,
            profilePicture: true,
            bannerImage: true,
            subscriberCount: true,
            isVerified: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    logger.error('Get current user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout (for mobile - remove device)
router.post('/logout', authMiddleware, async (req: any, res: Response): Promise<Response> => {
  try {
    const { deviceId } = req.body;

    if (deviceId && req.platform !== 'web') {
      await prisma.device.updateMany({
        where: {
          userId: req.userId!,
          deviceId: deviceId
        },
        data: {
          isActive: false,
          pushToken: null
        }
      });
    }

    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;