import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { protectedRoute } from "../../users/protected-route";
import { z } from "zod";

// Validation schema for creating a business
const createBusinessSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().optional(),
  category: z.enum([
    "FOOD_RESTAURANT",
    "RETAIL_SHOP",
    "SERVICES",
    "HOME_BUSINESS",
    "STREET_VENDOR",
    "ARTISAN",
    "OTHER",
  ]),
  address: z.string().optional(),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  location: z.string().optional(),
  upiId: z.string().optional(),
});

// GET /api/my-businesses - Get logged-in user's businesses
export const GET = protectedRoute(async (req: NextRequest) => {
  try {
    const userId = req.user.id;

    const businesses = await prisma.business.findMany({
      where: { ownerId: userId },
      include: {
        analytics: true,
        reviews: {
          include: {
            reviewer: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        endorsements: {
          include: {
            endorser: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: businesses,
    });
  } catch (error) {
    console.error("Error fetching user businesses:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch businesses" },
      { status: 500 }
    );
  }
});

// POST /api/my-businesses - Create new business for logged-in user
export const POST = protectedRoute(async (req: NextRequest) => {
  try {
    const userId = req.user.id;
    const body = await req.json();

    // Validate request body
    const validatedData = createBusinessSchema.parse(body);

    // Check if user has BUSINESS_OWNER role
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== "BUSINESS_OWNER" && user?.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "You need to be a business owner to create businesses",
        },
        { status: 403 }
      );
    }

    // Create the business
    const business = await prisma.business.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        category: validatedData.category,
        phone: validatedData.phone,
        address: validatedData.address,
        location: validatedData.location,
        upiId: validatedData.upiId,
        ownerId: userId,
        // Create analytics record
        analytics: {
          create: {
            totalReviews: 0,
            averageRating: 0,
            totalEndorsements: 0,
            monthlyVisits: 0,
            upiTransactionVolume: 0,
            customerRetentionRate: 0,
          },
        },
      },
      include: {
        analytics: true,
      },
    });

    // Update user role to BUSINESS_OWNER if not already
    // if (user?.role === "CUSTOMER") {
    //   await prisma.user.update({
    //     where: { id: userId },
    //     data: { role: "BUSINESS_OWNER" },
    //   });
    // }

    return NextResponse.json({
      success: true,
      data: business,
      message: "Business created successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error("Error creating business:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create business" },
      { status: 500 }
    );
  }
});
