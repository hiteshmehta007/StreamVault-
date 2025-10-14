import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  template?: string;
  data?: any;
}

let transporter: nodemailer.Transporter;

// Initialize email transporter
const initializeEmail = () => {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    if (!transporter) {
      initializeEmail();
    }

    const { to, subject, html, template, data } = options;

    let emailHtml = html;

    // Use template if provided
    if (template && data) {
      emailHtml = generateEmailFromTemplate(template, data);
    }

    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME || 'Video Streaming Platform'}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: emailHtml,
    });

    logger.info(`Email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error('Failed to send email:', error);
    return false;
  }
};

export const sendVerificationEmail = async (email: string, token: string): Promise<boolean> => {
  const verificationUrl = `${process.env.WEB_URL}/verify-email?token=${token}`;
  
  return await sendEmail({
    to: email,
    subject: 'Verify Your Email Address',
    template: 'verification',
    data: {
      verificationUrl,
      appName: process.env.APP_NAME || 'Video Streaming Platform'
    }
  });
};

export const sendPasswordResetEmail = async (email: string, token: string): Promise<boolean> => {
  const resetUrl = `${process.env.WEB_URL}/reset-password?token=${token}`;
  
  return await sendEmail({
    to: email,
    subject: 'Reset Your Password',
    template: 'password-reset',
    data: {
      resetUrl,
      appName: process.env.APP_NAME || 'Video Streaming Platform'
    }
  });
};

export const sendWelcomeEmail = async (email: string, username: string): Promise<boolean> => {
  return await sendEmail({
    to: email,
    subject: 'Welcome to Our Platform!',
    template: 'welcome',
    data: {
      username,
      appName: process.env.APP_NAME || 'Video Streaming Platform',
      dashboardUrl: `${process.env.WEB_URL}/dashboard`
    }
  });
};

export const sendNewSubscriberEmail = async (
  creatorEmail: string, 
  creatorName: string, 
  subscriberName: string
): Promise<boolean> => {
  return await sendEmail({
    to: creatorEmail,
    subject: 'New Subscriber!',
    template: 'new-subscriber',
    data: {
      creatorName,
      subscriberName,
      appName: process.env.APP_NAME || 'Video Streaming Platform',
      dashboardUrl: `${process.env.WEB_URL}/dashboard`
    }
  });
};

const generateEmailFromTemplate = (template: string, data: any): string => {
  const templates = {
    verification: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Welcome to ${data.appName}!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${data.verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          If you didn't sign up for ${data.appName}, please ignore this email.
        </p>
      </div>
    `,
    
    'password-reset': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>You requested to reset your password for ${data.appName}. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${data.resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          If you didn't request a password reset, please ignore this email and your password will remain unchanged.
        </p>
      </div>
    `,
    
    welcome: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Welcome to ${data.appName}, ${data.username}! 🎉</h2>
        <p>We're excited to have you join our community of creators and viewers!</p>
        <p>Here's what you can do now:</p>
        <ul style="line-height: 1.6;">
          <li>📹 Upload your first video</li>
          <li>🎨 Customize your channel</li>
          <li>👥 Start building your audience</li>
          <li>📊 Track your analytics</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.dashboardUrl}" 
             style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>
        <p>Happy creating!</p>
        <p>The ${data.appName} Team</p>
      </div>
    `,
    
    'new-subscriber': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">🎉 You have a new subscriber!</h2>
        <p>Hi ${data.creatorName},</p>
        <p><strong>${data.subscriberName}</strong> just subscribed to your channel!</p>
        <p>Keep creating amazing content to grow your audience even more.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.dashboardUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Dashboard
          </a>
        </div>
        <p>Best regards,<br>The ${data.appName} Team</p>
      </div>
    `
  };

  return templates[template as keyof typeof templates] || `<p>${JSON.stringify(data)}</p>`;
};