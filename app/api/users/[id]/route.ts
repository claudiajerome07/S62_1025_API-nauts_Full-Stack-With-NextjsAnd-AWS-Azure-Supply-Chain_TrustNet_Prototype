import {  NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { protectedRoute } from "../protected-route";

export const GET = protectedRoute(async ( { params }: any) => {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, user });
});
