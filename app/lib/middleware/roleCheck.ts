import { NextRequest } from "next/server";
import { verifyToken } from "./verify-token";

/**
 * Role-based access control middleware
 * @param allowedRoles Array of roles that can access the resource
 * @returns Middleware function that checks user role
 */
export function requireRole(allowedRoles: string[]) {
  return (req: NextRequest) => {
    const authResult = verifyToken(req);

    if ('error' in authResult) {
      return { error: authResult.error, status: authResult.status };
    }

    const decoded = authResult.decoded as any;
    const userRole = decoded.role;

    if (!allowedRoles.includes(userRole)) {
      return { 
        error: "Access denied: Insufficient permissions", 
        status: 403 
      };
    }

    return { 
      decoded: authResult.decoded,
      userId: decoded.userId,
      role: userRole
    };
  };
}

/**
 * Check if user is a business owner
 */
export function requireBusinessOwner(req: NextRequest) {
  return requireRole(['BUSINESS_OWNER'])(req);
}

/**
 * Check if user is a customer
 */
export function requireCustomer(req: NextRequest) {
  return requireRole(['CUSTOMER'])(req);
}

/**
 * Check if user is an admin
 */
export function requireAdmin(req: NextRequest) {
  return requireRole(['ADMIN'])(req);
}