// app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ValidationError, AuthenticationError } from "@/lib/customErrors";
import { withErrorHandler } from "@/lib/errorHandler";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // IMPORTANT: preserve newline characters
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req: Request) {

    const { idToken } = await req.json();
    if (!idToken) {
      throw new ValidationError("ID token is required");
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    // decoded contains uid, phone_number, email, etc.
    // Here: create or fetch a user in your DB, create app session cookie/jwt if desired.

    return sendSuccess(
      {
        user: {
          uid: decoded.uid,
          phone: decoded.phone_number,
          email: decoded.email,
        },
      },
      "OTP verified successfully"
    );
  
}
