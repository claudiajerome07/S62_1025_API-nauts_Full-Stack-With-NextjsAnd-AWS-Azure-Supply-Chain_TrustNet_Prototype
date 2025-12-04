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
          }
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
        analytics: true
      }
    });

    if (!business) {
      return sendError("Business not found", "BUSINESS_NOT_FOUND", 404);
    }

    // Calculate trust score breakdown
    const totalReviews = business.reviews.length;
    const totalEndorsements = business.endorsements.length;
    const averageRating = totalReviews > 0 
      ? business.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews 
      : 0;

    // Trust score calculation weights
    const weights = {
      reviews: 40,
      endorsements: 25,
      verification: 20,
      engagement: 15
    };

    // Calculate component scores
    const reviewScore = Math.min(100, (averageRating / 5) * 100 * (Math.min(totalReviews, 20) / 20));
    const endorsementScore = Math.min(100, (totalEndorsements / 10) * 100);
    const verificationScore = business.isVerified ? 
      (business.upiVerified ? 95 : 75) : 50;
    const engagementScore = business.analytics ? 
      Math.min(100, (business.analytics.customerRetentionRate * 100 + 50)) : 70;

    // Calculate weighted trust score
    const calculatedTrustScore = Math.round(
      (reviewScore * weights.reviews +
       endorsementScore * weights.endorsements +
       verificationScore * weights.verification +
       engagementScore * weights.engagement) / 100
    );

    // Score history (mock for now - in production, store historical data)
    const scoreHistory = [
      { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), score: Math.max(0, calculatedTrustScore - 15) },
      { date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(), score: Math.max(0, calculatedTrustScore - 10) },
      { date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(), score: Math.max(0, calculatedTrustScore - 8) },
      { date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), score: Math.max(0, calculatedTrustScore - 5) },
      { date: new Date().toISOString(), score: calculatedTrustScore },
    ];

    // Generate recommendations based on current state
    const recommendations = [];

    if (!business.upiVerified) {
      recommendations.push({
        id: '1',
        title: 'Complete UPI Verification',
        description: 'Verify your UPI ID to increase your verification score and build more trust.',
        impact: 'high' as const,
        action: 'Verify UPI'
      });
    }

    if (totalReviews < 10) {
      recommendations.push({
        id: '2',
        title: 'Encourage More Reviews',
        description: 'Reach out to recent customers for feedback to improve your review score.',
        impact: 'medium' as const,
        action: 'Share Profile Link'
      });
    }

    if (totalEndorsements < 5) {
      recommendations.push({
        id: '3',
        title: 'Request Community Endorsements',
        description: 'Ask local community members to endorse your business.',
        impact: 'medium' as const,
        action: 'Request Endorsements'
      });
    }

    if (!business.analytics || business.analytics.customerRetentionRate < 0.7) {
      recommendations.push({
        id: '4',
        title: 'Improve Customer Engagement',
        description: 'Focus on building stronger relationships with your customers.',
        impact: 'low' as const,
        action: 'View Tips'
      });
    }

    const trustScoreData = {
      currentScore: calculatedTrustScore,
      previousScore: Math.max(0, calculatedTrustScore - 7),
      scoreHistory,
      breakdown: {
        reviews: {
          score: Math.round(reviewScore),
          weight: weights.reviews,
          totalReviews,
          averageRating: parseFloat(averageRating.toFixed(1))
        },
        endorsements: {
          score: Math.round(endorsementScore),
          weight: weights.endorsements,
          totalEndorsements,
          communityScore: Math.min(100, totalEndorsements * 12)
        },
        verification: {
          score: Math.round(verificationScore),
          weight: weights.verification,
          phoneVerified: business.isVerified,
          upiVerified: business.upiVerified,
          communityVerified: totalEndorsements > 3
        },
        engagement: {
          score: Math.round(engagementScore),
          weight: weights.engagement,
          profileCompletion: business.description ? 90 : 70,
          responseRate: business.analytics?.customerRetentionRate ? 
            Math.round(business.analytics.customerRetentionRate * 100) : 85
        }
      },
      recommendations
    };

    return sendSuccess(trustScoreData);
  } catch (error) {
    console.error('Trust score breakdown error:', error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}