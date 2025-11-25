import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendSuccess, sendError } from "@/lib/responseHandler";

const businessSchema = z.object({
  name: z.string().min(1).max(100),
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
  phone: z.string().min(10),
  location: z.string().optional(),
  ownerId: z.string(), // Make sure to include ownerId
});

// Helper function to build where clause with proper typing
function buildWhereClause(searchParams: URLSearchParams) {
  const where: any = {};

  const category = searchParams.get("category");
  const verified = searchParams.get("verified");

  // Handle category filter - ensure it matches the enum values from your schema
  if (category) {
    const validCategories = [
      "FOOD_RESTAURANT",
      "RETAIL_SHOP",
      "SERVICES",
      "HOME_BUSINESS",
      "STREET_VENDOR",
      "ARTISAN",
      "OTHER",
    ];

    if (validCategories.includes(category)) {
      where.category = category;
    }
  }

  // Handle verified filter
  if (verified === "true" || verified === "false") {
    where.isVerified = verified === "true";
  }

  return where;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Use the helper function to build the where clause
    const where = buildWhereClause(searchParams);

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        include: {
          owner: { select: { name: true, phone: true } },
          _count: {
            select: { reviews: true, endorsements: true },
          },
        },
        orderBy: { trustScore: "desc" },
        skip,
        take: limit,
      }),
      prisma.business.count({ where }),
    ]);

    return sendSuccess({
      businesses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get businesses error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const businessData = businessSchema.parse(body);

    const business = await prisma.business.create({
      data: businessData,
      include: {
        owner: { select: { name: true, phone: true } },
      },
    });

    return sendSuccess(business, "Business created successfully", 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(
        "Invalid business data",
        "VALIDATION_ERROR",
        400,
        error.issues
      );
    }

    console.error("Create business error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
