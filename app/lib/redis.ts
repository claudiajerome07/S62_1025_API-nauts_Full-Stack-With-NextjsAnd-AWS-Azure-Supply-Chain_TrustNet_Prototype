// lib/redis.ts
import { Redis } from "ioredis";

// Detect environment and create appropriate Redis client
function createRedisClient() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.warn(
      "⚠️ REDIS_URL not found. Using mock Redis (caching disabled)."
    );
    return createMockRedis();
  }

  // Check if it's Upstash Redis (contains upstash.io)
  if (redisUrl.includes("upstash.io")) {
    console.log("🔗 Connecting to Upstash Redis...");
    // Upstash Redis uses rediss:// protocol and requires token in URL
    const url = new URL(redisUrl);
    const password = process.env.REDIS_TOKEN;

    return new Redis({
      host: url.hostname,
      port: parseInt(url.port) || 6379,
      password: password,
      tls: {}, // Upstash requires TLS
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      connectTimeout: 10000,
    });
  }
  // Check if it's local Redis
  else if (redisUrl.includes("localhost") || redisUrl.includes("127.0.0.1")) {
    console.log("🔗 Connecting to Local Redis...");
    return new Redis(redisUrl);
  }

  // Other cloud Redis services
  else {
    console.log("🔗 Connecting to Cloud Redis...");
    return new Redis(redisUrl, {
      connectTimeout: 10000,
      maxRetriesPerRequest: 3,
    });
  }
}
// Mock Redis for development when no Redis is available
function createMockRedis() {
  console.log("🔗 Using Mock Redis (development mode)");
  const mockData = new Map();

  return {
    get: (key: string) => Promise.resolve(mockData.get(key)),
    set: (key: string, value: any) => {
      mockData.set(key, value);
      return Promise.resolve("OK");
    },
    setex: (key: string, value: any) => {
      mockData.set(key, value);
      // Note: Mock doesn't actually expire, but that's fine for dev
      return Promise.resolve("OK");
    },
    del: (key: string) => {
      mockData.delete(key);
      return Promise.resolve(1);
    },
    keys: (pattern: string) => {
      const regex = new RegExp(pattern.replace(/\*/g, ".*"));
      return Promise.resolve(
        Array.from(mockData.keys()).filter((k) => regex.test(k))
      );
    },
    exists: (key: string) => Promise.resolve(mockData.has(key) ? 1 : 0),
    dbsize: () => Promise.resolve(mockData.size),
    info: () =>
      Promise.resolve(
        "redis_version:6.0.0\r\nused_memory:1024\r\nused_memory_human:1KB"
      ),
    on: (event: string, callback: Function) => {
      // Mock event listener
      if (event === "connect") setTimeout(() => callback(), 10);
      if (event === "error") {
      } // No-op for errors in mock
    },
    disconnect: () => Promise.resolve(),
    flushall: () => {
      mockData.clear();
      return Promise.resolve("OK");
    },
  } as any;
}

const redis = createRedisClient();

// Add connection event handlers
redis.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

redis.on("error", (error: unknown) => {
  console.error("❌ Redis connection error:", error);
});

export { redis };

export const CACHE_CONFIG = {
  TTL: {
    SHORT: 60 * 5, // 5 minutes
    MEDIUM: 60 * 30, // 30 minutes
    LONG: 60 * 60 * 24, // 24 hours
    VERY_LONG: 60 * 60 * 24 * 7, // 7 days
  },
  PREFIX: {
    BUSINESS: "business:",
    USER: "user:",
    BUSINESS_LIST: "businesses:",
    SEARCH: "search:",
    TRUST_SCORE: "trust:",
  },
};

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      if (data) {
        try {
          return JSON.parse(data) as T;
        } catch {
          return data as T;
        }
      }
      return null;
    } catch (error) {
      console.error("Redis get error:", error);
      return null;
    }
  }

  static async set(
    key: string,
    value: any,
    ttl: number = CACHE_CONFIG.TTL.MEDIUM
  ): Promise<boolean> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl > 0) {
        await redis.setex(key, ttl, serializedValue);
      } else {
        await redis.set(key, serializedValue);
      }
      return true;
    } catch (error) {
      console.error("Redis set error:", error);
      return false;
    }
  }

  static async del(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error("Redis delete error:", error);
      return false;
    }
  }

  static async delPattern(pattern: string): Promise<boolean> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(
          `🗑️ Deleted ${keys.length} keys matching pattern: ${pattern}`
        );
      }
      return true;
    } catch (error) {
      console.error("Redis delete pattern error:", error);
      return false;
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error("Redis exists error:", error);
      return false;
    }
  }

  static async getStats(): Promise<{ keys: number; memory: any; info: any }> {
    try {
      const [keys, info] = await Promise.all([redis.dbsize(), redis.info()]);
      const parsedInfo = this.parseInfo(info);

      return {
        keys,
        memory: {
          used_memory: parsedInfo.used_memory,
          used_memory_human: parsedInfo.used_memory_human,
        },
        info: {
          redis_version: parsedInfo.redis_version,
          uptime_in_seconds: parsedInfo.uptime_in_seconds,
          connected_clients: parsedInfo.connected_clients,
        },
      };
    } catch (error) {
      console.error("Redis stats error:", error);
      return { keys: 0, memory: {}, info: {} };
    }
  }

  static async flushAll(): Promise<boolean> {
    try {
      await redis.flushall();
      console.log("🗑️ Redis cache flushed");
      return true;
    } catch (error) {
      console.error("Redis flush error:", error);
      return false;
    }
  }

  private static parseInfo(info: string): any {
    return info.split("\r\n").reduce((acc: any, line: string) => {
      const [key, value] = line.split(":");
      if (key && value) acc[key] = value;
      return acc;
    }, {});
  }
}
