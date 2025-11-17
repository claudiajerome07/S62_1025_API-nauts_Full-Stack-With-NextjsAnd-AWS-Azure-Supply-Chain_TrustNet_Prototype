import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import redis from "@/lib/redis";

export async function GET() {
  try {
    const cacheKey = "users:list";
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log("Cache Hit");
      return NextResponse.json(JSON.parse(cachedData));
    }

    console.log("Cache Miss - Fetching from DB");
    const users = await prisma.user.findMany();

    // Cache data for 60 seconds (TTL)
    await redis.set(cacheKey, JSON.stringify(users), "EX", 60);

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch users", error }, { status: 500 });
  }
}