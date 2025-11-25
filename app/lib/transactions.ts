// lib/transactions.ts
import { prisma } from "./prisma";
import { PrismaClient } from "@prisma/client";

/**
 * Execute database operations within a transaction with proper error handling
 * and automatic rollback on failure
 */
export async function executeTransaction<T>(
  operations: (tx: any) => Promise<T>,
  options: {
    maxRetries?: number;
    timeout?: number;
  } = {}
): Promise<T> {
  const { maxRetries = 3, timeout = 5000 } = options;
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Execute with timeout to prevent hanging transactions
      const result = await Promise.race([
        prisma.$transaction(operations, {
          maxWait: timeout,
          timeout: timeout + 1000,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Transaction timeout")), timeout)
        ),
      ]);

      return result;
    } catch (error: any) {
      lastError = error;

      // Retry on deadlocks and serialization failures
      if (shouldRetryTransaction(error) && attempt < maxRetries) {
        console.warn(
          `Transaction attempt ${attempt} failed, retrying...`,
          error.message
        );
        await exponentialBackoff(attempt);
        continue;
      }

      break;
    }
  }

  console.error("Transaction failed after all retries:", lastError);
  throw new Error(`Transaction failed: ${lastError?.message}`);
}

/**
 * Check if a transaction error is retryable
 */
function shouldRetryTransaction(error: any): boolean {
  const retryableCodes = [
    "P2034", // Transaction deadlock
    "P2028", // Timeout
    "P2014", // Serialization failure
    "P2035", // Could not complete operation
  ];

  return (
    retryableCodes.includes(error?.code) ||
    error?.message?.includes("deadlock") ||
    error?.message?.includes("timeout")
  );
}

/**
 * Exponential backoff for retry attempts
 */
function exponentialBackoff(attempt: number): Promise<void> {
  const delay = Math.min(1000 * Math.pow(2, attempt), 30000); // Max 30 seconds
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Batch operations to reduce database round trips
 */
export async function batchOperations<T>(
  operations: (() => Promise<T>)[],
  batchSize: number = 10
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < operations.length; i += batchSize) {
    const batch = operations.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map((op) => op()));

    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        console.error("Batch operation failed:", result.reason);
        // Continue with other operations, don't fail entire batch
      }
    }
  }

  return results;
}

/**
 * Optimized batch operations with progress tracking
 */
export async function batchOperationsWithProgress<T>(
  operations: (() => Promise<T>)[],
  batchSize: number = 10,
  onProgress?: (completed: number, total: number) => void
): Promise<{ results: T[]; errors: Array<{ index: number; error: Error }> }> {
  const results: T[] = [];
  const errors: Array<{ index: number; error: Error }> = [];

  for (let i = 0; i < operations.length; i += batchSize) {
    const batch = operations.slice(i, i + batchSize);
    const batchPromises = batch.map((op, index) =>
      op().catch((error) => {
        errors.push({ index: i + index, error });
        return null;
      })
    );

    const batchResults = await Promise.all(batchPromises);

    // Filter out null results (errors)
    const successfulResults = batchResults.filter(
      (result) => result !== null
    ) as T[];
    results.push(...successfulResults);

    // Report progress
    if (onProgress) {
      onProgress(Math.min(i + batchSize, operations.length), operations.length);
    }

    // Small delay between batches to avoid overwhelming the database
    if (i + batchSize < operations.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return { results, errors };
}

/**
 * Read replica support for read-heavy operations
 */
export function getReadReplica() {
  // In production, you might have a read replica URL
  const readReplicaUrl = process.env.DATABASE_READ_REPLICA_URL;

  if (readReplicaUrl && process.env.NODE_ENV === "production") {
    return new PrismaClient({
      datasources: {
        db: { url: readReplicaUrl },
      },
    });
  }

  // Fall back to main database for development
  return prisma;
}

/**
 * Connection pool optimization for high-concurrency scenarios
 */
export class ConnectionPoolManager {
  private static activeConnections = 0;
  private static maxConnections = 10;

  static async withConnection<T>(operation: () => Promise<T>): Promise<T> {
    if (this.activeConnections >= this.maxConnections) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.withConnection(operation);
    }

    this.activeConnections++;

    try {
      return await operation();
    } finally {
      this.activeConnections--;
    }
  }
}
