import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../lib/middleware/verify-token";

export function protectedRoute(handler: any, allowedRoles?: string[]) {
  return async (req: NextRequest, ...args: any[]) => {
    const auth = verifyToken(req);

    if (auth.error) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
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
    req.user = auth.decoded;

    return handler(req, ...args);
  };
}
