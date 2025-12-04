import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { protectedRoute } from "../../../users/protected-route";
import { z } from "zod";

const updateBusinessSchema = z
  .object({
    name: z
      .string()
      .min(2, "Business name must be at least 2 characters")
      .optional(),
    description: z.string().optional(),
    category: z
      .enum([
        "FOOD_RESTAURANT",
        "RETAIL_SHOP",
        "SERVICES",
        "HOME_BUSINESS",
        "STREET_VENDOR",
        "ARTISAN",
        "OTHER",
      ])
      .optional(),
    address: z.string().optional(),
    phone: z.string().min(10, "Phone must be at least 10 digits").optional(),
    location: z.string().optional(),
    upiId: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// GET /api/my-businesses/[id] - Get specific business (only if owner)
export const GET = protectedRoute(async (req: NextRequest) => {
  try {
    const userId = req.user.id;
    const businessId = req.nextUrl.pathname.split("/").pop();

    if (!businessId) {
      return NextResponse.json(
        { success: false, error: "Business ID is required" },
        { status: 400 }
      );
    }

    const business = await prisma.business.findUnique({
      where: {
        id: businessId,
        ownerId: userId,
      },
      include: {
        analytics: true,
        reviews: {
          include: {
            reviewer: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        endorsements: {
          include: {
            endorser: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        upiTransactions: {
          orderBy: { timestamp: "desc" },
          take: 10,
        },
      },
    });

    if (!business) {
      return NextResponse.json(
        { success: false, error: "Business not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: business,
    });
  } catch (error) {
    console.error("Error fetching business:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch business" },
      { status: 500 }
    );
  }
});

// PUT /api/businesses/my-business/[id] - Update business
export const PUT = protectedRoute(async (req: NextRequest) => {
  try {
    const userId = req.user.id;
    const businessId = req.nextUrl.pathname.split('/').pop();
    
    if (!businessId) {
      return NextResponse.json(
        { success: false, error: "Business ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    
    // Validate request body
    const validatedData = updateBusinessSchema.parse(body);

    // First check if business exists and user owns it
    const existingBusiness = await prisma.business.findUnique({
      where: { id: businessId }
    });

    if (!existingBusiness) {
      return NextResponse.json(
        { success: false, error: "Business not found" },
        { status: 404 }
      );
    }

    if (existingBusiness.ownerId !== userId) {
      return NextResponse.json(
        { success: false, error: "You don't have permission to update this business" },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: any = { ...validatedData };
    
    // If UPI ID is being updated, reset UPI verification status
    if (body.upiId !== undefined && body.upiId !== existingBusiness.upiId) {
      updateData.upiId = body.upiId;
      updateData.upiVerified = false;
      updateData.upiVerificationDate = null;
    }

    // Update the business
    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: updateData,
      include: {
        analytics: true
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedBusiness,
      message: "Business updated successfully"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed",
          details: error.errors 
        },
        { status: 400 }
      );
    }

    console.error("Error updating business:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update business" },
      { status: 500 }
    );
  }
});