import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../lib/middleware/verify-token";

export function protectedRoute(handler: any, allowedRoles?: string[]) {
  return async (req: NextRequest, ...args: any[]) => {
    const auth = verifyToken(req);

    if (auth.error || !auth.decoded) {
      return NextResponse.json(
        { success: false, message: auth.error || "Authentication failed" },
        { status: auth.status || 401 }
      );
    }

    // If specific roles are required
    if (allowedRoles && !allowedRoles.includes(auth.decoded.role)) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Access denied" },
        { status: 403 }
      );
    }

    // Pass the decoded user to the handler
    req.user = {
      id: auth.decoded.id,
      role: auth.decoded.role
    };

    return handler(req, ...args);
  };
}
