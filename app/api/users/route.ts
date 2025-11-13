import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";
import { sendSuccess } from "@/lib/responseHandler";
import { DatabaseError } from "@/lib/customErrors";
import { withErrorHandler } from "@/lib/errorHandler";

async function GET() {
  
    const users = await prisma.user.findMany();
    return sendSuccess({ users });
  
}

export const GETHandler = withErrorHandler(GET, "users-get");
export { GETHandler as GET };
