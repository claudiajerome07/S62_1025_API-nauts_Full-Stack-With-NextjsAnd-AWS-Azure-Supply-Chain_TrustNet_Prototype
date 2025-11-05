import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET() {
  try {
    // Simple query to check DB connectivity
    const result = await prisma.$queryRaw`SELECT NOW()`;
    return NextResponse.json({ message: "Connected to database!", result });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { error: "Failed to connect to database", details: error },
      { status: 500 }
    );
  }
}
