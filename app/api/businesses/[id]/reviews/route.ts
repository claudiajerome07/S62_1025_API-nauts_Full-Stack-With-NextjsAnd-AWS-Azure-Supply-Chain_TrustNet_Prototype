import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
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

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
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
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
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

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid review data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Create review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function updateBusinessAnalytics(businessId: string) {
  const reviews = await prisma.review.findMany({
    where: { businessId },
  });

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

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
}
