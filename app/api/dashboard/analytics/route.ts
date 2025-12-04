import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/middleware/verify-token';
import { sendError, sendSuccess } from '@/lib/responseHandler';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30days';
    
    // Verify authentication
    const authResult = verifyToken(request);
    if ('error' in authResult) {
      return sendError(authResult.error, "UNAUTHORIZED", authResult.status || 401);
    }

    const decoded = authResult.decoded as any;
    const userId = decoded.userId;

    // Find user's business
    const business = await prisma.business.findFirst({
      where: { ownerId: userId },
      include: {
        analytics: true,
        reviews: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!business) {
      return sendError("Business not found", "BUSINESS_NOT_FOUND", 404);
    }

    // Calculate date range
    const now = new Date();
    const daysAgo = timeRange === '7days' ? 7 : timeRange === '90days' ? 90 : 30;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Mock analytics data (in production, you would track actual analytics)
    const baseViews = business.analytics?.monthlyVisits || 100;
    const thisMonth = Math.floor(baseViews * 0.8 + Math.random() * baseViews * 0.4);
    const lastMonth = Math.floor(baseViews * 0.7 + Math.random() * baseViews * 0.3);

    // Generate weekly data
    const weeklyData = [];
    const weeks = Math.ceil(daysAgo / 7);
    for (let i = 0; i < weeks; i++) {
      weeklyData.push({
        week: `Week ${i + 1}`,
        views: Math.floor(thisMonth / weeks) + Math.floor(Math.random() * 20 - 10)
      });
    }

    // Mock location data
    const topLocations = [
      { location: 'Local Area (2km)', views: Math.floor(thisMonth * 0.6), percentage: 60 },
      { location: 'City Center', views: Math.floor(thisMonth * 0.2), percentage: 20 },
      { location: 'Nearby Districts', views: Math.floor(thisMonth * 0.15), percentage: 15 },
      { location: 'Other', views: Math.floor(thisMonth * 0.05), percentage: 5 },
    ];

    // Mock view times
    const viewTimes = [
      { hour: '9-12 AM', views: Math.floor(thisMonth * 0.25) },
      { hour: '12-3 PM', views: Math.floor(thisMonth * 0.30) },
      { hour: '3-6 PM', views: Math.floor(thisMonth * 0.25) },
      { hour: '6-9 PM', views: Math.floor(thisMonth * 0.20) },
    ];

    // Calculate engagement metrics
    const recentReviews = business.reviews.filter((r: any) => 
      new Date(r.createdAt) >= startDate
    ).length;

    const contactClicks = Math.floor(thisMonth * 0.15);
    const reviewClicks = Math.floor(recentReviews * 1.5);
    const endorsementRequests = Math.floor(Math.random() * 5 + 2);

    // Calculate business metrics
    const discoveryRate = Math.min(100, Math.floor(70 + Math.random() * 25));
    const conversionRate = parseFloat((contactClicks / thisMonth * 100).toFixed(1));
    const returnVisitors = Math.floor(thisMonth * 0.2);

    // Mock peak hours
    const peakHours = [
      { hour: '11 AM', views: Math.floor(Math.random() * 15 + 5) },
      { hour: '1 PM', views: Math.floor(Math.random() * 20 + 8) },
      { hour: '4 PM', views: Math.floor(Math.random() * 18 + 6) },
      { hour: '7 PM', views: Math.floor(Math.random() * 12 + 4) },
    ];

    const analyticsData = {
      profileViews: {
        total: business.analytics?.monthlyVisits || thisMonth,
        thisMonth,
        lastMonth,
        weeklyData
      },
      customerDemographics: {
        topLocations,
        viewTimes
      },
      engagement: {
        averageTimeOnProfile: `${Math.floor(Math.random() * 3 + 1)}m ${Math.floor(Math.random() * 60)}s`,
        contactClicks,
        reviewClicks,
        endorsementRequests
      },
      businessMetrics: {
        discoveryRate,
        conversionRate,
        returnVisitors,
        peakHours
      }
    };

    return sendSuccess(analyticsData);
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}