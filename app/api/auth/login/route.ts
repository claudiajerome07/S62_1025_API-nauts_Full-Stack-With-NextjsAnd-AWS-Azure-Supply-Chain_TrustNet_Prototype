import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError } from "@/lib/responseHandler";

// ENV SECRET
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";

const loginSchema = z.object({
  phone: z.string().min(10, "Invalid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = loginSchema.parse(body);

    // Check user exists
    const user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      return sendError("User not found", "USER_NOT_FOUND", 404);
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError("Incorrect password", "INVALID_CREDENTIALS", 401);
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Attach cookie
    const response = sendSuccess(
      {
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
        },
        token,
      },
      "Login successful",
      200
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(
        "Invalid input data",
        "VALIDATION_ERROR",
        400,
        error.issues
      );
    }

    console.error("Login error:", error);
    return sendError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
