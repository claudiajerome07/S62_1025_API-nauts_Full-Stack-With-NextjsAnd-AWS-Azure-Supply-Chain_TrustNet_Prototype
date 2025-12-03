import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function verifyToken(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return { error: "Unauthorized: Token missing", status: 401 };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    return { decoded };
  } catch (error) {
    return { error: "Invalid or expired token", status: 401 };
  }
}
