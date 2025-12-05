import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function verifyToken(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return { error: "Unauthorized: Token missing", status: 401 };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Add userId to decoded for easier access in API routes
    return { 
      decoded: {
        ...decoded,
        userId: decoded.id // Map 'id' to 'userId' for consistency
      }
    };
  } catch (error) {
    return { error: "Invalid or expired token", status: 401 };
  }
}
