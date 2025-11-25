import { NextResponse } from "next/server";
import { executeTransaction, batchOperations } from "@/lib/transactions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test 1: Simple transaction
    const result = await executeTransaction(async (tx) => {
      const users = await tx.user.findMany({ take: 1 });
      return { users: users.length };
    });

    // Test 2: Batch operations
    const batchResults = await batchOperations([
      () => prisma.user.count(),
      () => prisma.business.count(),
    ]);

    return NextResponse.json({
      success: true,
      transactionTest: result,
      batchTest: batchResults,
      message: "Transaction utilities working correctly!",
    });
  } catch (error) {
    // Handle the error safely - TypeScript knows error is 'unknown'
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: "Transaction test failed",
      },
      { status: 500 }
    );
  }
}
