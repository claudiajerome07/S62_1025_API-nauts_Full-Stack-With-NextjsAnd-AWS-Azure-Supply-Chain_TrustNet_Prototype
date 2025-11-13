import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSuccess } from "@/lib/responseHandler";
import { DatabaseError } from "@/lib/customErrors";
import { withErrorHandler } from "@/lib/errorHandler";

async function GET(request: NextRequest) {
  
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    const where = {
      ...(query && {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      }),
      ...(category && { category }),
      ...(location && {
        location: { contains: location, mode: "insensitive" },
      }),
    };

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
