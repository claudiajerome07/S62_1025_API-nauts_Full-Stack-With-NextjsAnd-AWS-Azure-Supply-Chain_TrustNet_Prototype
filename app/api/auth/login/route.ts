import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  phone: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = loginSchema.parse(body);

    // In production, send OTP via SMS service
    // For development, return success with mock OTP
    const mockOtp = "123456";

    return NextResponse.json({
      message: "OTP sent successfully",
      // Remove this in production
      debugOtp: process.env.NODE_ENV === "development" ? mockOtp : undefined,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
