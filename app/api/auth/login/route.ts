// app/api/auth/login/route.ts
import { NextRequest } from "next/server";
import { z } from "zod";
import { sendSuccess } from "@/lib/responseHandler";
import { withErrorHandler } from "@/lib/errorHandler";

const loginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

async function POST(request: NextRequest) {
  const body = await request.json();
  const { phone } = loginSchema.parse(body);

  const mockOtp = "123456";

  return sendSuccess(
    {
      debugOtp: process.env.NODE_ENV === "development" ? mockOtp : undefined,
    },
    "OTP sent successfully"
  );
}

// Use the error handler wrapper
export const POSTHandler = withErrorHandler(POST, "auth-login");
export { POSTHandler as POST };
