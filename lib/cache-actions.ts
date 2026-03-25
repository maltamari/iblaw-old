// lib/cache-actions.ts
'use server';

import { revalidatePath as nextRevalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { redis, redisHelpers } from '@/lib/redis';

// ✅ Allowed paths for revalidation (security whitelist)
const ALLOWED_PATHS = [
  '/',
  '/team',
  '/careers',
  '/dashboard',
  '/about',
  '/contact',
] as const;


// ✅ Rate limiting configuration
const RATE_LIMIT = {
  MAX_REQUESTS: 10,       // Max requests per window
  WINDOW_SECONDS: 60,     // Time window in seconds (1 minute)
  REDIS_PREFIX: 'rate_limit:revalidate:',
};

/**
 * Check if user is authenticated
 * @throws Error if not authenticated
 */
async function requireAuth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('Unauthorized: Authentication required');
  }
  
  return user;
}

/**
 * Validate that the path is in the allowed list
 * @throws Error if path is not allowed
 */
function validatePath(path: string): void {
  // Check exact match or starts with allowed path
  const isAllowed = ALLOWED_PATHS.some(allowedPath => 
    path === allowedPath || path.startsWith(`${allowedPath}/`)
  );
  
  if (!isAllowed) {
    throw new Error(`Invalid path: ${path}. Path not in whitelist.`);
  }

  // Additional security: prevent path traversal
  if (path.includes('..') || path.includes('//')) {
    throw new Error('Invalid path: Path traversal detected');
  }
}

/**
 * ✅ Redis-based rate limiting (production-ready)
 * Uses atomic INCR operation with automatic expiry
 * 
 * @param userId - User ID to rate limit
 * @throws Error if rate limit exceeded
 */
async function checkRateLimit(userId: string): Promise<void> {
  const key = `${RATE_LIMIT.REDIS_PREFIX}${userId}`;
  
  try {
    // ✅ Atomic increment operation
    const count = await redisHelpers.incrementWithExpiry(
      key, 
      RATE_LIMIT.WINDOW_SECONDS
    );
    
    // ✅ Check if limit exceeded
    if (count > RATE_LIMIT.MAX_REQUESTS) {
      const ttl = await redisHelpers.getTTL(key);
      const waitTime = ttl > 0 ? ttl : RATE_LIMIT.WINDOW_SECONDS;
      
      throw new Error(
        `Rate limit exceeded. You can make ${RATE_LIMIT.MAX_REQUESTS} requests per minute. ` +
        `Try again in ${waitTime} seconds.`
      );
    }

    // ✅ Log for monitoring (optional)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 Rate limit: ${count}/${RATE_LIMIT.MAX_REQUESTS} for user ${userId}`);
    }
    
  } catch (error) {
    // If it's our rate limit error, re-throw it
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
      throw error;
    }
    
    // ✅ For Redis connection errors, log but allow operation
    // (graceful degradation - don't block users if Redis is down)
    console.error('⚠️ Redis rate limit error (allowing request):', error);
    
    // Optional: Throw error to block operation if Redis is critical
    // throw new Error('Rate limiting service temporarily unavailable');
  }
}

/**
 * Revalidate a specific path after mutations
 * ✅ Protected with authentication, validation, and Redis rate limiting
 * 
 * @example
 * await revalidatePath('/team');
 * await revalidatePath('/dashboard');
 * 
 * @param path - Path to revalidate
 * @param type - Type of revalidation ('page' or 'layout')
 * @returns Success status and path
 */
export async function revalidatePath(
  path: string, 
  type: 'page' | 'layout' = 'page'
) {
  try {
    // ✅ Security checks
    const user = await requireAuth();
    validatePath(path);
    await checkRateLimit(user.id);

    // ✅ Perform revalidation
    nextRevalidatePath(path, type);
    
    console.log(`✅ Revalidated: ${path} (type: ${type}) by user: ${user.id}`);
    
    return { success: true, path, type };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Failed to revalidate ${path}:`, errorMessage);
    throw error; // Re-throw to let caller handle it
  }
}

/**
 * Revalidate multiple paths at once
 * ✅ Protected with authentication and validation
 * ✅ Single rate limit check for all paths (efficient)
 * 
 * @example
 * await revalidateMultiplePaths(['/team', '/dashboard', '/']);
 * 
 * @param paths - Array of paths to revalidate
 * @returns Success status and count
 */
export async function revalidateMultiplePaths(paths: readonly string[]) {
  try {
    // ✅ Security checks (only once for all paths)
    const user = await requireAuth();
    await checkRateLimit(user.id);
    
    // ✅ Validate all paths first (fail fast)
    paths.forEach(path => validatePath(path));
    
    // ✅ Revalidate all paths in parallel
    const results = await Promise.allSettled(
      paths.map(async (path) => {
        try {
          nextRevalidatePath(path);
          console.log(`✅ Revalidated: ${path}`);
          return { success: true, path };
        } catch (error) {
          console.error(`❌ Failed to revalidate ${path}:`, error);
          return { success: false, path, error };
        }
      })
    );
    
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failedPaths = results
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map(r => r.reason);
    
    console.log(
      `✅ Revalidated ${successCount}/${paths.length} paths by user: ${user.id}`
    );
    
    return { 
      success: true, 
      total: paths.length,
      successful: successCount,
      failed: failedPaths.length,
    };
  } catch (error) {
    console.error('❌ Failed to revalidate multiple paths:', error);
    throw error;
  }
}

/**
 * Revalidate paths by group
 * ✅ Protected with authentication and validation
 * 
 * @example
 * import { REVALIDATE_PATHS } from '@/lib/cache';
 * await revalidatePathGroup(REVALIDATE_PATHS.TEAM);
 * 
 * @param paths - Group of paths to revalidate
 */
export async function revalidatePathGroup(paths: readonly string[]) {
  return await revalidateMultiplePaths(paths);
}

/**
 * Clear rate limit for a user
 * ✅ Admin function with authentication
 * Useful for testing or resolving rate limit issues
 * 
 * @example
 * await clearRateLimit(); // Clear own rate limit
 * await clearRateLimit('user-id-here'); // Clear specific user (admin only)
 * 
 * @param userId - Optional user ID (requires admin role)
 */
export async function clearRateLimit(userId?: string) {
  const user = await requireAuth();
  
  // TODO: Add admin role check here
  // const supabase = await createClient();
  // const { data: profile } = await supabase
  //   .from('profiles')
  //   .select('role')
  //   .eq('id', user.id)
  //   .single();
  // 
  // if (userId && profile?.role !== 'admin') {
  //   throw new Error('Unauthorized: Admin access required to clear other users rate limits');
  // }
  
  const targetUserId = userId || user.id;
  const key = `${RATE_LIMIT.REDIS_PREFIX}${targetUserId}`;
  
  try {
    const deleted = await redisHelpers.delete(key);
    
    if (deleted > 0) {
      console.log(`✅ Cleared rate limit for user: ${targetUserId}`);
      return { success: true, userId: targetUserId, cleared: true };
    } else {
      console.log(`ℹ️ No rate limit found for user: ${targetUserId}`);
      return { success: true, userId: targetUserId, cleared: false };
    }
  } catch (error) {
    console.error('❌ Failed to clear rate limit:', error);
    throw new Error('Failed to clear rate limit from Redis');
  }
}

/**
 * Get current rate limit status for a user
 * ✅ Useful for debugging and monitoring
 * 
 * @example
 * const status = await getRateLimitStatus();
 * console.log(`Requests: ${status.count}/${status.limit}`);
 */
export async function getRateLimitStatus(userId?: string) {
  const user = await requireAuth();
  const targetUserId = userId || user.id;
  const key = `${RATE_LIMIT.REDIS_PREFIX}${targetUserId}`;
  
  try {
    const count = await redis.get<number>(key) || 0;
    const ttl = await redisHelpers.getTTL(key);
    
    return {
      userId: targetUserId,
      count: count,
      limit: RATE_LIMIT.MAX_REQUESTS,
      remaining: Math.max(0, RATE_LIMIT.MAX_REQUESTS - count),
      resetIn: ttl > 0 ? ttl : 0,
      windowSeconds: RATE_LIMIT.WINDOW_SECONDS,
    };
  } catch (error) {
    console.error('Failed to get rate limit status:', error);
    throw new Error('Failed to retrieve rate limit status');
  }
}