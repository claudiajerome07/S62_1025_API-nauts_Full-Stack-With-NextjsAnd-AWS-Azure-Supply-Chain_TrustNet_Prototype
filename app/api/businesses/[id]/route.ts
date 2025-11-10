import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// FIX: This tells Next.js to expect an 'id' parameter
export async function generateStaticParams() {
  return []; // Return empty array for dynamic routes
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

    console.log("Business ID:", id);

    if (!id) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        owner: { select: { name: true, phone: true } },
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
        analytics: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(business);
  } catch (error) {
    console.error("Get business error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // FIX: Await the params
    const params = await context.params;
    const { id } = params;

    console.log("Updating business ID:", id);

    if (!id) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const business = await prisma.business.update({
      where: { id },
      data: body,
      include: {
        owner: { select: { name: true, phone: true } },
      },
    });

    return NextResponse.json(business);
  } catch (error) {
    console.error("Update business error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
