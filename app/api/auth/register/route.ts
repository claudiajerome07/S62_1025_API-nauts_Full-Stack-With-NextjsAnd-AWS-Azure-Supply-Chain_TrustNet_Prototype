import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  phone: z.string().min(10),
  name: z.string().min(2),
  businessName: z.string().optional(),
  role: z.enum(["CUSTOMER", "BUSINESS_OWNER"]).default("CUSTOMER"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, name, businessName, role } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this phone number" },
        { status: 400 }
      );
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        phone,
        name,
        role,
      },
    });

    // If business owner, create business profile
    let business = null;
    if (role === "BUSINESS_OWNER" && businessName) {
      business = await prisma.business.create({
        data: {
          name: businessName,
          phone,
          ownerId: user.id,
          category: "OTHER",
        },
      });
    }

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
        },
        business,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
