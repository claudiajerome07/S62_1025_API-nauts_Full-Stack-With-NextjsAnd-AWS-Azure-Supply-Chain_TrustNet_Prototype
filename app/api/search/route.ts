import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/lib/responseHandler";
// import { DatabaseError } from "@/lib/customErrors";
import { withErrorHandler } from "@/lib/errorHandler";

// Define valid categories based on your Prisma schema
const validCategories = [
  "FOOD_RESTAURANT",
  "RETAIL_SHOP",
  "SERVICES",
  "HOME_BUSINESS",
  "STREET_VENDOR",
  "ARTISAN",
  "OTHER",
] as const;

// Helper function to build where clause with proper typing
function buildWhereClause(searchParams: URLSearchParams) {
  const where: any = {};

  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const location = searchParams.get("location");

  // Handle search query
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  // Handle category filter with validation
  if (category && validCategories.includes(category as any)) {
    where.category = category;
  }

  // Handle location filter
  if (location) {
    where.location = { contains: location, mode: "insensitive" };
  }

  return where;
}

async function GET(request: NextRequest) {
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
        owner: { select: { name: true } },
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
}

export const GETHandler = withErrorHandler(GET, "search-businesses");
export { GETHandler as GET };
