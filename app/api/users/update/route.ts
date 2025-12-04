import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { z } from "zod";
import { protectedRoute } from "../protected-route";

const updateSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z.string().min(10, "Phone must be at least 10 digits").optional(),
    email: z
      .string()
      .email("Invalid email")
      .optional()
      .or(z.literal(""))
      .nullable(), // Add this line
  })
  .refine((data) => data.name || data.phone, {
    message: "At least one field must be provided",
  });

export const PATCH = protectedRoute(async (req: NextRequest) => {
  try {
    const userId = req.user.id;

    const body = await req.json();
    const data = updateSchema.parse(body);

    // Handle email properly - convert empty string to null
    const updateData = {
      ...data,
      email: data.email === "" || data.email === undefined ? null : data.email,
    };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    await redis.del("users:list");

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        email: updatedUser.email, // Make sure to include email in response
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Update failed",
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
});
