// lib/redis.ts
import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error('UPSTASH_REDIS_REST_URL is not defined');
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('UPSTASH_REDIS_REST_TOKEN is not defined');
}

// ✅ Singleton Redis instance
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ✅ Helper functions for common operations
export const redisHelpers = {
  /**
   * Set a key with automatic expiry
   */
  async setWithExpiry(key: string, value: unknown, seconds: number) {
    await redis.set(key, value, { ex: seconds });
  },

  /**
   * Get and parse JSON value
   */
  async getJSON<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value as T | null;
  },

  /**
   * Increment with automatic expiry on first increment
   */
  async incrementWithExpiry(key: string, expiry: number): Promise<number> {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, expiry);
    }
    return count;
  },

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key);
    return result === 1;
  },

  /**
   * Delete one or multiple keys
   */
  async delete(...keys: string[]): Promise<number> {
    if (keys.length === 0) return 0;
    return await redis.del(...keys);
  },

  /**
   * Get remaining TTL in seconds
   */
  async getTTL(key: string): Promise<number> {
    return await redis.ttl(key);
  },
};