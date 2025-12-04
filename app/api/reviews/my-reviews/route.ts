// src/app/api/reviews/my-reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSideAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const auth = await getServerSideAuth();
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Get user's reviews
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { reviewerId: auth.id },
        include: {
          business: {
            select: {
              id: true,
              name: true,
              
              category: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.review.count({ where: { reviewerId: auth.id } }),
    ]);

    return NextResponse.json({
      success: true,
      data: reviews,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get my reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch your reviews" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a review
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const auth = await getServerSideAuth();
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get review ID from query params
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return NextResponse.json(
        { success: false, error: "Review ID is required" },
        { status: 400 }
      );
    }

    // Check if review exists and belongs to user
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        reviewerId: auth.id,
      },
    });

    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found or access denied" },
        { status: 404 }
      );
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: reviewId },
    });

    // Update business stats
    const stats = await prisma.review.aggregate({
      where: { businessId: review.businessId },
      _count: { rating: true },
      _avg: { rating: true },
    });

    await prisma.business.update({
      where: { id: review.businessId },
      data: {
        reviewCount: stats._count.rating,
        averageRating: stats._avg.rating || 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
