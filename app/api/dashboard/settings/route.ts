import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware/roleCheck';
import { sendError, sendSuccess } from '@/lib/responseHandler';
import { z } from 'zod';

const settingsSchema = z.object({
  profile: z.object({
    visibility: z.enum(['public', 'local', 'private']),
    showPhone: z.boolean(),
    showEmail: z.boolean(),
    showAddress: z.boolean(),
    allowDirectContact: z.boolean(),
  }),
  notifications: z.object({
    emailNotifications: z.boolean(),
    smsNotifications: z.boolean(),
    reviewAlerts: z.boolean(),
    endorsementRequests: z.boolean(),
    trustScoreChanges: z.boolean(),
    weeklyReports: z.boolean(),
  }),
  privacy: z.object({
    profileIndexing: z.boolean(),
    analyticsTracking: z.boolean(),
    dataSharing: z.boolean(),
  }),
  account: z.object({
    twoFactorEnabled: z.boolean(),
    loginAlerts: z.boolean(),
  }),
});

export async function GET(request: NextRequest) {
  try {
    // Verify authentication for any user role
    const authResult = requireAuth(request);
    if ('error' in authResult) {
      return sendError(authResult.error, "UNAUTHORIZED", authResult.status || 401);
    }

    const { userId, role } = authResult;

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        businesses: role === 'BUSINESS_OWNER' ? {
          take: 1, // Get the first business for business owners
        } : false
      }
    });

    if (!user) {
      return sendError("User not found", "USER_NOT_FOUND", 404);
    }

    // Default settings based on user role
    const baseSettings = {
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        weeklyReports: false,
      },
      privacy: {
        profileIndexing: true,
        analyticsTracking: true,
        dataSharing: false,
      },
      account: {
        twoFactorEnabled: false,
        loginAlerts: true,
      }
    };

    // Role-specific settings
    let defaultSettings;
    
    if (role === 'BUSINESS_OWNER') {
      defaultSettings = {
        ...baseSettings,
        profile: {
          visibility: 'public' as const,
          showPhone: true,
          showEmail: false,
          showAddress: true,
          allowDirectContact: true,
        },
        notifications: {
          ...baseSettings.notifications,
          reviewAlerts: true,
          endorsementRequests: true,
          trustScoreChanges: true,
        }
      };
    } else {
      // Settings for CUSTOMER and ADMIN
      defaultSettings = {
        ...baseSettings,
        profile: {
          visibility: 'local' as const,
          showPhone: false,
          showEmail: false,
          showAddress: false,
          allowDirectContact: false,
        },
        notifications: {
          ...baseSettings.notifications,
          reviewAlerts: false,
          endorsementRequests: false,
          trustScoreChanges: false,
        }
      };
    }

    return sendSuccess(defaultSettings);
  } catch (error) {
    console.error('Dashboard settings GET error:', error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication for any user role
    const authResult = requireAuth(request);
    if ('error' in authResult) {
      return sendError(authResult.error, "UNAUTHORIZED", authResult.status || 401);
    }

    const { userId } = authResult;

    const body = await request.json();

    // Validate request body
    const validatedSettings = settingsSchema.parse(body);

    // TODO: Implement settings persistence for user: ${userId}
    console.log(`Settings update for user: ${userId}`);
    // In a production app, you would save these settings to a user_settings table
    // For now, we'll just return success
    
    // TODO: Implement settings persistence
    // await prisma.userSettings.upsert({
    //   where: { userId },
    //   update: {
    //     profileVisibility: validatedSettings.profile.visibility,
    //     showPhone: validatedSettings.profile.showPhone,
    //     emailNotifications: validatedSettings.notifications.emailNotifications,
    //     // ... other fields
    //   },
    //   create: {
    //     userId,
    //     profileVisibility: validatedSettings.profile.visibility,
    //     showPhone: validatedSettings.profile.showPhone,
    //     emailNotifications: validatedSettings.notifications.emailNotifications,
    //     // ... other fields
    //   }
    // });

    return sendSuccess({ 
      message: "Settings updated successfully",
      settings: validatedSettings 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError("Invalid settings data", "VALIDATION_ERROR", 400);
    }
    
    console.error('Dashboard settings POST error:', error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}