    import { NextRequest, NextResponse } from "next/server";
    import { prisma } from "@/lib/prisma";
    import { protectedRoute } from "../protected-route";

    export const GET = protectedRoute(async (req: any) => {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    return NextResponse.json({ success: true, user });
    });
