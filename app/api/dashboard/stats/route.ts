import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireBusinessOwner } from '@/lib/middleware/roleCheck';
import { sendError, sendSuccess } from '@/lib/responseHandler';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication and role
    const authResult = requireBusinessOwner(request);
    if ('error' in authResult) {
      return sendError(authResult.error, "UNAUTHORIZED", authResult.status || 401);
    }

    const { userId } = authResult;

    // Find user's business
    const business = await prisma.business.findFirst({
      where: { ownerId: userId },
      include: {
        reviews: {
          include: {
            reviewer: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        endorsements: {
          include: {
            endorser: {
              select: {
                name: true
              }
            }
          }
        },
        analytics: true,
        _count: {
          select: {
            reviews: true,
            endorsements: true
          }
        }
      }
    });

    if (!business) {
      return sendError("Business not found", "BUSINESS_NOT_FOUND", 404);
    }

    // Calculate recent reviews (last 3)
    const recentReviews = business.reviews.slice(0, 3).map((review: any) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment || '',
      reviewer: review.reviewer.name,
      createdAt: review.createdAt.toISOString(),
    }));

    // Count approved endorsements
    const approvedEndorsements = business.endorsements.filter((_: any) => 
      // Assuming endorsements are approved by default for now
      // In a real system, you might have an 'approved' field
      true
    ).length;

    // Count pending endorsement requests (this would need additional logic in a real system)
    const pendingEndorsements = Math.max(0, business.endorsements.length - approvedEndorsements);

    // Get monthly visits from analytics or calculate
    const monthlyVisits = business.analytics?.monthlyVisits || 0;

    const stats = {
      trustScore: business.trustScore,
      totalReviews: business._count.reviews,
      totalEndorsements: approvedEndorsements,
      monthlyVisits,
      pendingEndorsements,
      recentReviews,
    };

    return sendSuccess(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}