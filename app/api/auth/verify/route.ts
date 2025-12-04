import { NextRequest } from "next/server";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
  try {
    console.log('Verify endpoint called');
    
    // Get token from cookie
    const token = request.cookies.get('auth_token')?.value;
    console.log('Token from cookie:', token ? 'exists' : 'not found');
    
    if (!token) {
      console.log('No token found in cookie');
      return sendError("No authentication token found", "UNAUTHORIZED", 401);
    }

    console.log('JWT_SECRET exists:', !!JWT_SECRET);
    
    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('Decoded token:', decoded);
    
    const userResponse = {
      user: {
        id: decoded.id,
        role: decoded.role
      },
      token: token
    };
    
    console.log('Sending response:', userResponse);
    
    return sendSuccess(userResponse, "Authentication verified", 200);
    
  } catch (error) {
    console.error("Auth verification error:", error);
    return sendError("Invalid authentication token", "UNAUTHORIZED", 401);
  }
}