// app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

// Mock user data for development fallback
const mockUsers = [
  {
    uid: "user-1",
    phone_number: "+919876543210",
    email: "raj@example.com",
    name: "Raj Sharma",
  },
  {
    uid: "user-2",
    phone_number: "+919876543211",
    email: "priya@example.com",
    name: "Priya Patel",
  },
];

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { success: false, message: "ID token is required" },
        { status: 400 }
      );
    }

    // Try to use Firebase Admin for verification
    if (adminAuth) {
      try {
        const decodedToken = await adminAuth.verifyIdToken(idToken);

        // Token is valid - now create or get user from your database
        const user = await findOrCreateUserInDatabase(decodedToken);

        return NextResponse.json({
          success: true,
          user: {
            uid: user.uid,
            phone: user.phone_number,
            email: user.email,
            name: user.name,
          },
          message: "OTP verified successfully",
        });
      } catch (firebaseError) {
        console.error("Firebase token verification failed:", firebaseError);
        // Fall through to mock authentication in development
      }
    }

    // Fallback: Mock authentication for development
    if (process.env.NODE_ENV !== "production") {
      console.log("🔐 Development mode - using mock authentication");

      await new Promise((resolve) => setTimeout(resolve, 100));
      const mockUser = mockUsers[0];

      return NextResponse.json({
        success: true,
        user: {
          uid: mockUser.uid,
          phone: mockUser.phone_number,
          email: mockUser.email,
          name: mockUser.name,
        },
        message: "OTP verified successfully (development mode)",
      });
    }

    // Production fallback - no Firebase Admin configured
    return NextResponse.json(
      {
        success: false,
        message: "Authentication service unavailable",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Auth verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Authentication failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Helper function to find or create user in your database
async function findOrCreateUserInDatabase(decodedToken: any) {
  // Here you would typically:
  // 1. Check if user exists in your database by phone/uid
  // 2. If not, create a new user record
  // 3. Return the user data

  // For now, return the decoded token info
  return {
    uid: decodedToken.uid,
    phone_number: decodedToken.phone_number,
    email: decodedToken.email || "",
    name: decodedToken.name || "User",
  };
}
