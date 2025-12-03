import { NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sendSuccess, sendError } from "@/lib/responseHandler";

const registerSchema = z.object({
  phone: z.string().min(10, "Invalid phone number"),
  name: z.string().min(2, "Name is too short"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["CUSTOMER", "BUSINESS_OWNER"]).default("CUSTOMER"),

  // only required if role is BUSINESS_OWNER
  businessName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, name, password, role, businessName } =
      registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { phone } });

    if (existingUser) {
      return sendError(
        "User already exists with this phone number",
        "USER_EXISTS",
        400
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        phone,
        name,
        password: hashedPassword,
        role,
      },
    });

    // If user is business owner → auto-create business
    let business = null;

    if (role === "BUSINESS_OWNER") {
      if (!businessName) {
        return sendError(
          "Business name is required for business owners",
          "MISSING_BUSINESS_NAME",
          400
        );
      }

      business = await prisma.business.create({
        data: {
          name: businessName,
          phone,
          ownerId: user.id,
          category: "OTHER",
        },
      });
    }

    return sendSuccess(
      {
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
        },
        business,
      },
      "User registered successfully",
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(
        "Invalid input data",
        "VALIDATION_ERROR",
        400,
        error.issues
      );
    }

    console.error("Registration error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
