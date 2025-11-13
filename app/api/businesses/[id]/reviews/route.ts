import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendSuccess } from "@/lib/responseHandler";
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
} from "@/lib/customErrors";
import { withErrorHandler } from "@/lib/errorHandler";


const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  reviewerId: z.string(),
});

// FIX: Add generateStaticParams for Next.js App Router
export async function generateStaticParams() {
  return [];
}

// FIX: Use the correct parameter structure
async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  
    // FIX: Await the params
    const params = await context.params;
    const { id } = params;

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { businessId: id },
        include: {
          reviewer: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.review.count({ where: { businessId: id } }),
    ]);

    return sendSuccess({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  
}

async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  
    // FIX: Await the params
    const params = await context.params;
    const { id } = params;

    const body = await request.json();
    const { rating, comment, reviewerId } = reviewSchema.parse(body);

    // Verify business exists
    const business = await prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      throw new NotFoundError("Business");
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        businessId: id,
        reviewerId,
        isVerified: true, // Auto-verify for now
      },
      include: {
        reviewer: { select: { name: true } },
      },
    });

    // Update business analytics
    await updateBusinessAnalytics(id);

    return sendSuccess(review, "Review created successfully", 201);
  
}

async function updateBusinessAnalytics(businessId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { businessId },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    await prisma.businessAnalytics.upsert({
      where: { businessId },
      update: {
        totalReviews: reviews.length,
        averageRating,
        lastUpdated: new Date(),
      },
      create: {
        businessId,
        totalReviews: reviews.length,
        averageRating,
        lastUpdated: new Date(),
      },
    });
  } catch (error) {
    throw new DatabaseError("Failed to update business analytics", error);
  }
}

export const GETHandler = withErrorHandler(GET, "business-reviews-get");
export const POSTHandler = withErrorHandler(POST, "business-reviews-create");
export { GETHandler as GET, POSTHandler as POST };
