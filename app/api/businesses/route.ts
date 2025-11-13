import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendSuccess } from "@/lib/responseHandler";
import { ValidationError, DatabaseError } from "@/lib/customErrors";
import { withErrorHandler } from "@/lib/errorHandler";

const businessSchema = z.object({
  name: z.string().min(1),
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
});

async function GET(request: NextRequest) {
 
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const category = searchParams.get("category");
    const verified = searchParams.get("verified");

    const skip = (page - 1) * limit;

    const where = {
      ...(category && { category }),
      ...(verified && { isVerified: verified === "true" }),
    };

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
  
}

async function POST(request: NextRequest) {
    const body = await request.json();
    const businessData = businessSchema.parse(body);

    const business = await prisma.business.create({
      data: {
        ...businessData,
        owner: {
          connectOrCreate: {
            where: { phone: businessData.phone },
            create: { name: businessData.name, phone: businessData.phone },
          },
        },
      },
    });

    return sendSuccess(business, "Business created successfully", 201);
 
}

export const GETHandler = withErrorHandler(GET, "businesses-get");
export const POSTHandler = withErrorHandler(POST, "businesses-create");
export { GETHandler as GET, POSTHandler as POST };
