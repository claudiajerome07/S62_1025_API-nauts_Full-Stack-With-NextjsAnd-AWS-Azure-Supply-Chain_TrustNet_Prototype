import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";
import { sendSuccess } from "@/lib/responseHandler";
import {
  ValidationError,
  ConflictError,
  DatabaseError,
} from "@/lib/customErrors";
import { withErrorHandler } from "@/lib/errorHandler";

const registerSchema = z.object({
  phone: z.string().min(10),
  name: z.string().min(2),
  businessName: z.string().optional(),
  role: z.enum(["CUSTOMER", "BUSINESS_OWNER"]).default("CUSTOMER"),
});

async function POST(request: NextRequest) {
  
    const body = await request.json();

    // Parse and validate with custom error handling
    let validatedData;
    try {
      validatedData = registerSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        throw new ValidationError("Validation failed", formattedErrors);
      }
      throw error;
    }

    const { phone, name, businessName, role } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      throw new ConflictError("User already exists with this phone number");
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
  } 

  export const POSTHandler = withErrorHandler(POST, "auth-register");
  export { POSTHandler as POST };
