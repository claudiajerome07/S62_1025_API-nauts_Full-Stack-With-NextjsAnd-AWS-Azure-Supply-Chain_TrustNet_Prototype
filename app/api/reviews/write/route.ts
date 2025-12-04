// src/app/api/reviews/write/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSideAuth } from "@/lib/auth";

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

    // Parse request body
    const body = await request.json();
    const { businessId, rating, comment } = body;

    // Validate required fields
    if (!businessId || !rating) {
      return NextResponse.json(
        { success: false, error: "Business ID and rating are required" },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if business exists
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, ownerId: true, name: true },
    });

    if (!business) {
      return NextResponse.json(
        { success: false, error: "Business not found" },
        { status: 404 }
      );
    }

    // Prevent self-review
    if (business.ownerId === auth.id) {
      return NextResponse.json(
        { success: false, error: "You cannot review your own business" },
        { status: 403 }
      );
    }

    // Check if user already reviewed this business
    const existingReview = await prisma.review.findFirst({
      where: {
        businessId,
        reviewerId: auth.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: "You have already reviewed this business" },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment || null,
        businessId,
        reviewerId: auth.id,
        isVerified: false,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // ✅ REMOVED THE BUSINESS STATS UPDATE SECTION
    // If you want stats later, add reviewCount and averageRating to Business model

    return NextResponse.json(
      {
        success: true,
        message: "Review created successfully",
        data: review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create review" },
      { status: 500 }
    );
  }
}
