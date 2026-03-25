// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest } from 'next/server';
import { hasEnvVar, getEnv } from '@/lib/validations/env';

// ==================== Redis Client Setup ====================

let redis: Redis | null = null;

function getRedisClient(): Redis | null {
  // Check if Redis is configured
  if (!hasEnvVar('UPSTASH_REDIS_REST_URL') || !hasEnvVar('UPSTASH_REDIS_REST_TOKEN')) {
    console.warn('⚠️ Redis not configured - rate limiting will use in-memory fallback');
    return null;
  }

  if (!redis) {
    const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = getEnv();
    
    redis = new Redis({
      url: UPSTASH_REDIS_REST_URL!,
      token: UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  return redis;
}

// ==================== In-Memory Fallback (Development) ====================

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const inMemoryStore = new Map<string, RateLimitStore>();

class InMemoryRateLimiter {
  private interval: number;

  constructor(interval: number) {
    this.interval = interval;
  }

  async check(identifier: string, limit: number): Promise<{
    success: boolean;
    remaining: number;
    reset: number;
  }> {
    const now = Date.now();
    const store = inMemoryStore.get(identifier);

    // Cleanup expired entries periodically
    this.cleanup();

    if (!store || now > store.resetTime) {
      // Create new entry
      inMemoryStore.set(identifier, {
        count: 1,
        resetTime: now + this.interval,
      });

      return {
        success: true,
        remaining: limit - 1,
        reset: now + this.interval,
      };
    }

    if (store.count >= limit) {
      return {
        success: false,
        remaining: 0,
        reset: store.resetTime,
      };
    }

    store.count++;
    inMemoryStore.set(identifier, store);

    return {
      success: true,
      remaining: limit - store.count,
      reset: store.resetTime,
    };
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, store] of inMemoryStore.entries()) {
      if (now > store.resetTime) {
        inMemoryStore.delete(key);
      }
    }
  }
}

// ==================== Rate Limiter Factory ====================

interface RateLimiterConfig {
  interval: number; // in milliseconds
  limit: number;
}

class RateLimiterWrapper {
  private redisLimiter: Ratelimit | null = null;
  private inMemoryLimiter: InMemoryRateLimiter;
  private config: RateLimiterConfig;

  constructor(config: RateLimiterConfig) {
    this.config = config;
    this.inMemoryLimiter = new InMemoryRateLimiter(config.interval);

    // Try to initialize Redis limiter
    const redisClient = getRedisClient();
    if (redisClient) {
      this.redisLimiter = new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(config.limit, `${config.interval}ms`),
        analytics: true,
        prefix: '@ratelimit',
      });
      console.log('✅ Rate limiter initialized with Redis');
    } else {
      console.log('⚠️ Rate limiter using in-memory fallback (development only)');
    }
  }

  async check(request: NextRequest): Promise<{
    success: boolean;
    remaining: number;
    reset: number;
  }> {
    const identifier = this.getIdentifier(request);

    try {
      if (this.redisLimiter) {
        // Use Redis-backed rate limiter
        const { success, remaining, reset } = await this.redisLimiter.limit(identifier);
        
        return {
          success,
          remaining,
          reset,
        };
      } else {
        // Fallback to in-memory
        return await this.inMemoryLimiter.check(identifier, this.config.limit);
      }
    } catch (error) {
      console.error('❌ Rate limiter error:', error);
      // On error, allow the request (fail open)
      return {
        success: true,
        remaining: this.config.limit,
        reset: Date.now() + this.config.interval,
      };
    }
  }

  private getIdentifier(request: NextRequest): string {
    // Get IP address from various headers (for different hosting providers)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
    
    const ip = cfConnectingIp || 
               (forwarded ? forwarded.split(',')[0].trim() : null) || 
               realIp || 
               'unknown';
    
    // Add user agent hash for additional identification
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const uaHash = this.simpleHash(userAgent);
    
    return `${ip}-${uaHash}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 8);
  }
}

// ==================== Pre-configured Rate Limiters ====================

/**
 * Authentication rate limiter
 * 5 attempts per 15 minutes
 */
export const authRateLimiter = new RateLimiterWrapper({
  interval: 15 * 60 * 1000, // 15 minutes
  limit: 5,
});

/**
 * API rate limiter
 * 60 requests per minute
 */
export const apiRateLimiter = new RateLimiterWrapper({
  interval: 60 * 1000, // 1 minute
  limit: 60,
});

/**
 * Contact form rate limiter
 * 3 submissions per hour
 */
export const contactFormRateLimiter = new RateLimiterWrapper({
  interval: 60 * 60 * 1000, // 1 hour
  limit: 3,
});

/**
 * Job application rate limiter
 * 5 applications per day
 */
export const jobApplicationRateLimiter = new RateLimiterWrapper({
  interval: 24 * 60 * 60 * 1000, // 24 hours
  limit: 5,
});

// ==================== Helper for Server Actions ====================

/**
 * Check rate limit in server actions
 * @param request - Next.js request object
 * @param limiter - Rate limiter to use
 * @returns Error object if rate limited, null if allowed
 */
export async function checkRateLimit(
  request: NextRequest,
  limiter: RateLimiterWrapper
): Promise<{ error: string } | null> {
  const result = await limiter.check(request);

  if (!result.success) {
    const minutesUntilReset = Math.ceil((result.reset - Date.now()) / 1000 / 60);
    
    return {
      error: `Rate limit exceeded. Please try again in ${minutesUntilReset} minute(s).`,
    };
  }

  return null;
}

// ==================== Export for middleware usage ====================

export { RateLimiterWrapper };
export type { RateLimiterConfig };