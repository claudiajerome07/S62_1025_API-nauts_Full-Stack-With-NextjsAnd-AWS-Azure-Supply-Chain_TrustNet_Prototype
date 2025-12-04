import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireBusinessOwner } from '@/lib/middleware/roleCheck';
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
    // Verify authentication and role
    const authResult = requireBusinessOwner(request);
    if ('error' in authResult) {
      return sendError(authResult.error, "UNAUTHORIZED", authResult.status || 401);
    }

    const { userId } = authResult;

    // Find user and business settings
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        businesses: {
          take: 1, // Get the first business for now
        }
      }
    });

    if (!user) {
      return sendError("User not found", "USER_NOT_FOUND", 404);
    }

    // Default settings (in production, you might store these in the database)
    const defaultSettings = {
      profile: {
        visibility: 'public' as const,
        showPhone: true,
        showEmail: false,
        showAddress: true,
        allowDirectContact: true,
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        reviewAlerts: true,
        endorsementRequests: true,
        trustScoreChanges: true,
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

    return sendSuccess(defaultSettings);
  } catch (error) {
    console.error('Dashboard settings GET error:', error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication and role
    const authResult = requireBusinessOwner(request);
    if ('error' in authResult) {
      return sendError(authResult.error, "UNAUTHORIZED", authResult.status || 401);
    }

    // const { userId } = authResult; // Uncomment if needed
    const body = await request.json();

    // Validate request body
    const validatedSettings = settingsSchema.parse(body);

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