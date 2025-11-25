// lib/query-optimization.ts
// import { Prisma } from "@prisma/client";

/**
 * Optimized query builder with performance best practices
 */
export class QueryOptimizer {
  /**
   * Build efficient WHERE clauses with proper indexing consideration
   */
  static buildWhereClause(filters: Record<string, any>): any {
    const where: any = {};

    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null) continue;

      // Handle special cases first
      if (key === "OR" && Array.isArray(value)) {
        // OR conditions should be an array of conditions
        where.OR = value;
        continue;
      }

      if (key === "AND" && Array.isArray(value)) {
        // AND conditions should be an array of conditions
        where.AND = value;
        continue;
      }

      // Handle different filter types optimally
      switch (typeof value) {
        case "string":
          // For enum fields, use exact match. For text fields, use contains.
          if (this.isEnumField(key)) {
            where[key] = value; // Exact match for enums
          } else {
            where[key] = { contains: value, mode: "insensitive" } as any;
          }
          break;
        case "number":
          // Exact match for numbers
          where[key] = value;
          break;
        case "boolean":
          // Boolean filters
          where[key] = value;
          break;
        case "object":
          // Handle date ranges, arrays, etc.
          if (Array.isArray(value)) {
            where[key] = { in: value } as any;
          } else if (value.gte !== undefined || value.lte !== undefined) {
            // Range queries
            where[key] = value;
          } else if (value.contains !== undefined) {
            // Direct contains object
            where[key] = { ...value, mode: "insensitive" } as any;
          }
          break;
        default:
          where[key] = value;
      }
    }

    return where;
  }

  /**
   * Build search conditions for text fields
   */
  static buildSearchConditions(search: string, searchFields: string[]): any {
    if (!search || searchFields.length === 0) return undefined;

    return {
      OR: searchFields.map((field) => ({
        [field]: { contains: search, mode: "insensitive" } as any,
      })),
    };
  }

  /**
   * Check if a field is an enum type
   */
  private static isEnumField(fieldName: string): boolean {
    const enumFields = [
      "category",
      "role",
      "verificationMethod",
      "relationship",
      "businessCategory",
      "userRole",
      "endorsementType",
    ];
    return enumFields.includes(fieldName);
  }

  /**
   * Build efficient pagination with cursor-based pagination support
   */
  static buildPagination(
    page: number = 1,
    limit: number = 10,
    cursor?: { id: string }
  ): { skip?: number; take: number; cursor?: { id: string } } {
    if (cursor) {
      // Cursor-based pagination (more efficient for large datasets)
      return {
        cursor,
        take: limit,
        skip: 1, // Skip the cursor itself
      };
    } else {
      // Offset-based pagination
      return {
        skip: (page - 1) * limit,
        take: limit,
      };
    }
  }

  /**
   * Select only necessary fields to reduce data transfer
   */
  static buildSelect<T>(fields: (keyof T)[]): Record<keyof T, boolean> {
    const select: any = {};
    fields.forEach((field) => {
      select[field as string] = true;
    });
    return select;
  }

  /**
   * Optimize ordering for indexed columns
   */
  static buildOrderBy(
    sortBy: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ): any {
    // Map common sort fields to indexed columns
    const indexedFields = ["createdAt", "updatedAt", "trustScore", "name"];

    if (!indexedFields.includes(sortBy)) {
      console.warn(
        `Sorting by non-indexed field: ${sortBy}. Consider adding an index.`
      );
    }

    return { [sortBy]: sortOrder };
  }

  /**
   * Optimize SELECT fields based on view type
   */
  static buildOptimizedSelect(viewType: "list" | "detail" | "card"): any {
    const selectConfigs = {
      list: {
        id: true,
        name: true,
        category: true,
        trustScore: true,
        isVerified: true,
        location: true,
        createdAt: true,
      },
      card: {
        id: true,
        name: true,
        category: true,
        trustScore: true,
        isVerified: true,
        location: true,
        description: true,
      },
      detail: {
        id: true,
        name: true,
        description: true,
        category: true,
        address: true,
        phone: true,
        location: true,
        trustScore: true,
        isVerified: true,
        verificationMethod: true,
        upiVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    };

    return selectConfigs[viewType] || selectConfigs.list;
  }

  /**
   * Batch multiple queries into single operations
   */
  static async batchQueries(
    queries: Array<{ key: string; query: () => Promise<any> }>
  ) {
    const results: Record<string, any> = {};

    // Execute all queries in parallel
    const queryResults = await Promise.allSettled(
      queries.map((q) => q.query())
    );

    queries.forEach((query, index) => {
      const result = queryResults[index];
      results[query.key] = result.status === "fulfilled" ? result.value : null;
    });

    return results;
  }
}

/**
 * Advanced query optimization strategies
 */
export class AdvancedQueryOptimizer {
  /**
   * Preload relationships to avoid N+1 queries
   */
  static buildEagerLoadingIncludes(resource: string): any {
    const includeConfigs: Record<string, any> = {
      business: {
        owner: {
          select: { name: true, phone: true },
        },
        _count: {
          select: { reviews: true, endorsements: true },
        },
        reviews: {
          take: 5, // Limit to recent reviews
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            reviewer: {
              select: { name: true },
            },
          },
        },
      },
      user: {
        businesses: {
          take: 10,
          select: {
            id: true,
            name: true,
            trustScore: true,
          },
        },
      },
    };

    return includeConfigs[resource] || {};
  }

  /**
   * Cache key generator for Redis caching
   */
  static generateCacheKey(
    resource: string,
    filters: Record<string, any>,
    pagination?: { page: number; limit: number }
  ): string {
    const filterString = JSON.stringify(filters);
    const paginationString = pagination
      ? `page:${pagination.page}-limit:${pagination.limit}`
      : "";

    return `query:${resource}:${Buffer.from(filterString).toString("base64")}:${paginationString}`;
  }

  /**
   * Query complexity analyzer
   */
  static analyzeQueryComplexity(query: any): {
    complexity: number;
    warnings: string[];
  } {
    let complexity = 0;
    const warnings: string[] = [];

    // Count relations being loaded
    if (query.include) {
      const relationCount = Object.keys(query.include).length;
      complexity += relationCount * 10;

      if (relationCount > 3) {
        warnings.push(
          `High relation count: ${relationCount}. Consider splitting queries.`
        );
      }
    }

    // Check for expensive operations
    if (query.where?.OR) {
      complexity += query.where.OR.length * 5;
    }

    if (query.where?.contains) {
      complexity += 15; // Text search is expensive
      warnings.push("Text search (contains) detected - ensure proper indexing");
    }

    // Pagination impact
    if (query.skip && query.skip > 1000) {
      complexity += 20;
      warnings.push(
        "Deep pagination detected - consider cursor-based pagination"
      );
    }

    return { complexity, warnings };
  }
}

/**
 * Query result transformer for efficient data shaping
 */
export class QueryResultTransformer {
  /**
   * Transform Prisma results to minimize payload size
   */
  static transformBusinesses(businesses: any[]) {
    return businesses.map((business) => ({
      id: business.id,
      name: business.name,
      description: business.description,
      category: business.category,
      trustScore: business.trustScore,
      isVerified: business.isVerified,
      location: business.location,
      owner: business.owner,
      stats: {
        reviewCount: business._count?.reviews || 0,
        endorsementCount: business._count?.endorsements || 0,
        recentReviews: business.reviews || [],
      },
    }));
  }

  /**
   * Flatten nested relationships for better performance
   */
  static flattenBusinessDetails(business: any) {
    return {
      ...business,
      ownerName: business.owner?.name,
      ownerPhone: business.owner?.phone,
      reviewStats: {
        total: business._count?.reviews || 0,
        average: business.reviews?.length
          ? business.reviews.reduce(
              (sum: number, r: any) => sum + r.rating,
              0
            ) / business.reviews.length
          : 0,
      },
    };
  }
}

/**
 * Query performance monitoring
 */
export class QueryMonitor {
  private static queries: Map<string, { count: number; totalTime: number }> =
    new Map();

  static startTracking(queryId: string): () => number {
    const startTime = Date.now();

    return () => {
      const duration = Date.now() - startTime;
      const existing = this.queries.get(queryId) || { count: 0, totalTime: 0 };

      this.queries.set(queryId, {
        count: existing.count + 1,
        totalTime: existing.totalTime + duration,
      });

      // Log slow queries
      if (duration > 1000) {
        // 1 second threshold
        console.warn(`Slow query detected: ${queryId} took ${duration}ms`);
      }

      return duration;
    };
  }

  static getStats(): Array<{ query: string; avgTime: number; count: number }> {
    const stats: Array<{ query: string; avgTime: number; count: number }> = [];

    this.queries.forEach((value, key) => {
      stats.push({
        query: key,
        avgTime: value.totalTime / value.count,
        count: value.count,
      });
    });

    return stats.sort((a, b) => b.avgTime - a.avgTime);
  }

  static resetStats(): void {
    this.queries.clear();
  }
}
