import { NextResponse } from "next/server";
import { QueryOptimizer, QueryMonitor } from "@/lib/query-optimization";

export async function GET() {
  try {
    // Test 1: WHERE clause building
    const whereClause = QueryOptimizer.buildWhereClause({
      name: "test",
      trustScore: 80,
      isVerified: true,
      category: ["FOOD_RESTAURANT", "RETAIL_SHOP"],
    });

    // Test 2: Pagination
    const pagination = QueryOptimizer.buildPagination(2, 5);

    // Test 3: Field selection
    const selectFields = QueryOptimizer.buildSelect([
      "id",
      "name",
      "trustScore",
    ]);

    // Test 4: Order by
    const orderBy = QueryOptimizer.buildOrderBy("trustScore", "desc");

    // Test 5: Query monitoring
    const trackQuery = QueryMonitor.startTracking("test_query");
    await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate query
    const queryTime = trackQuery();

    const stats = QueryMonitor.getStats();

    return NextResponse.json({
      success: true,
      tests: {
        whereClause,
        pagination,
        selectFields,
        orderBy,
        queryTime,
        stats,
      },
      message: "Query optimization utilities working correctly!",
    });
  } catch (error) {
    // Handle the error safely - TypeScript knows error is 'unknown'
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: "Query optimization test failed",
      },
      { status: 500 }
    );
  }
}
