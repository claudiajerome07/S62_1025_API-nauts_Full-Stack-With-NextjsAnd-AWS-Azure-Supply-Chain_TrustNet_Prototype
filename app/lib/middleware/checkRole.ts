import { NextRequest } from "next/server";
import { verifyToken } from "./verify-token";

export function checkRole(allowedRoles: string[]) {
  return (req: NextRequest) => {
    const { decoded, error, status } = verifyToken(req);

    if (error) return { error, status };

    const userRole = (decoded as any).role;

    if (!allowedRoles.includes(userRole)) {
      return { error: "Access denied: Insufficient permissions", status: 403 };
    }

    return { decoded };
  };
}
