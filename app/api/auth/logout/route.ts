import { sendSuccess } from "@/lib/responseHandler";

export async function POST() {
  const response = sendSuccess({}, "Logout successful", 200);
  
  // Clear the auth cookie
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // Expire immediately
  });

  return response;
}