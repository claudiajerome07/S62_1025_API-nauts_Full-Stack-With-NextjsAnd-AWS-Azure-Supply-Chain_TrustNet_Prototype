// src/app/api/reviews/manage/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSideAuth } from "@/lib/auth";

// GET - Get reviews for businesses owned by user
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

    // ✅ FIX: Check if user is a BUSINESS_OWNER
    if (auth.role !== "BUSINESS_OWNER") {
      return NextResponse.json(
        { success: false, error: "Access denied. Business owners only." },
        { status: 403 }
      );
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Get businesses owned by this user
    const ownedBusinesses = await prisma.business.findMany({
      where: { ownerId: auth.id },
      select: { id: true },
    });

    if (ownedBusinesses.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        meta: { total: 0, page: 1, limit: 10, pages: 0 },
      });
    }

    const businessIds = ownedBusinesses.map((b) => b.id);

    // Get reviews for owned businesses
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          businessId: { in: businessIds },
        },
        include: {
          reviewer: {
            select: { id: true, name: true },
          },
          business: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: { businessId: { in: businessIds } },
      }),
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
    console.error("Get managed reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST - Reply to a review
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const auth = await getServerSideAuth();
    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ FIX: Check if user is a BUSINESS_OWNER
    if (auth.role !== "BUSINESS_OWNER") {
      return NextResponse.json(
        { success: false, error: "Access denied. Business owners only." },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { reviewId, reply } = body;

    // Validate required fields
    if (!reviewId) {
      return NextResponse.json(
        { success: false, error: "Review ID is required" },
        { status: 400 }
      );
    }

    if (!reply || reply.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Reply text is required" },
        { status: 400 }
      );
    }

    // Check reply length
    if (reply.length > 500) {
      return NextResponse.json(
        { success: false, error: "Reply must be less than 500 characters" },
        { status: 400 }
      );
    }

    // Get review with business info
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        business: {
          select: { id: true, ownerId: true },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    // Check if user owns the business
    if (review.business.ownerId !== auth.id) {
      return NextResponse.json(
        { success: false, error: "Not authorized to reply to this review" },
        { status: 403 }
      );
    }

    // Update review with owner reply
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ownerReply: reply.trim(),
        repliedAt: new Date(),
      },
      include: {
        reviewer: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Reply added successfully",
      data: updatedReview,
    });
  } catch (error) {
    console.error("Reply to review error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add reply" },
      { status: 500 }
    );
  }
}
