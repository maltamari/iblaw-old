// lib/cache.ts
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

type CacheOptions = {
  revalidate?: number; // seconds
  tags?: string[];
};

/**
 * Create a cached database query function with React cache()
 * ✅ Automatic deduplication within a single request
 * ✅ Type-safe with generics
 * 
 * Use this for:
 * - Database queries that might be called multiple times in one render
 * - Expensive computations that should be cached per-request
 * 
 * @example
 * // Simple query
 * const getTeamMembers = createCachedQuery(
 *   async () => {
 *     const supabase = await createClient();
 *     return supabase.from('team_members').select('*');
 *   }
 * );
 * 
 * @example
 * // Query with parameters
 * const getTeamMemberBySlug = createCachedQuery(
 *   async (slug: string) => {
 *     const supabase = await createClient();
 *     return supabase.from('team_members').select('*').eq('slug', slug).single();
 *   }
 * );
 */
export function createCachedQuery<TArgs extends unknown[], TResult>(
  queryFn: (...args: TArgs) => Promise<TResult>
) {
  // React cache automatically deduplicates calls within a single request
  return cache(queryFn);
}

/**
 * Create a cached query with Next.js unstable_cache
 * ✅ Persists across requests (not just per-request like React cache)
 * ✅ Supports revalidation and cache tags
 * 
 * Use this for:
 * - Data that rarely changes (team members, site settings)
 * - Public data that can be shared across all users
 * 
 * ⚠️ WARNING: Do NOT use for user-specific data unless you include user ID in the cache key
 * 
 * @example
 * const getPublicTeamMembers = createPersistedQuery(
 *   async () => {
 *     const supabase = await createClient();
 *     return supabase.from('team_members').select('*').eq('public', true);
 *   },
 *   ['team-members-public'], // cache key
 *   { 
 *     revalidate: 3600, // 1 hour
 *     tags: ['team'] 
 *   }
 * );
 * 
 * @example
 * // With parameters - include params in cache key!
 * const getTeamMemberBySlug = (slug: string) => createPersistedQuery(
 *   async () => {
 *     const supabase = await createClient();
 *     return supabase.from('team_members').select('*').eq('slug', slug).single();
 *   },
 *   ['team-member', slug], // ✅ Include slug in key
 *   { revalidate: 300, tags: ['team', `member-${slug}`] }
 * )();
 */
export function createPersistedQuery<TResult>(
  queryFn: () => Promise<TResult>,
  keyParts: string[],
  options?: CacheOptions
) {
  return unstable_cache(
    queryFn,
    keyParts,
    {
      revalidate: options?.revalidate,
      tags: options?.tags,
    }
  );
}

/**
 * Cache durations (in seconds)
 * Use these in page-level revalidate config or with createPersistedQuery
 * 
 * @example
 * // In page.tsx or layout.tsx
 * export const revalidate = CACHE_DURATION.MEDIUM;
 * 
 * @example
 * // With createPersistedQuery
 * const getSettings = createPersistedQuery(
 *   async () => {...},
 *   ['site-settings'],
 *   { revalidate: CACHE_DURATION.VERY_LONG }
 * );
 */
export const CACHE_DURATION = {
  SHORT: 60,           // 1 minute - for frequently changing data
  MEDIUM: 300,         // 5 minutes - for moderately changing data
  LONG: 3600,          // 1 hour - for rarely changing data
  VERY_LONG: 86400,    // 24 hours - for very stable data
} as const;

/**
 * Common path groups for easy revalidation
 * Use with revalidatePathGroup() or revalidateMultiplePaths()
 * 
 * @example
 * import { revalidatePathGroup } from '@/lib/cache-actions';
 * import { REVALIDATE_PATHS } from '@/lib/cache';
 * 
 * // After adding a team member
 * await revalidatePathGroup(REVALIDATE_PATHS.TEAM);
 * 
 * // After posting a job
 * await revalidatePathGroup(REVALIDATE_PATHS.JOBS);
 */
export const REVALIDATE_PATHS = {
  TEAM: ['/team', '/dashboard'] as const,
  JOBS: ['/careers', '/dashboard'] as const,
  APPLICATIONS: ['/dashboard'] as const,
  MESSAGES: ['/dashboard'] as const,
  ALL: ['/team', '/careers', '/dashboard', '/'] as const,
} as const;

/**
 * Cache tags for granular revalidation
 * Use with Next.js revalidateTag()
 * 
 * @example
 * import { revalidateTag } from 'next/cache';
 * 
 * // After updating team data
 * revalidateTag(CACHE_TAGS.TEAM);
 * 
 * // After updating a specific member
 * revalidateTag(`${CACHE_TAGS.TEAM_MEMBER}-${slug}`);
 */
export const CACHE_TAGS = {
  TEAM: 'team',
  TEAM_MEMBER: 'team-member',
  JOBS: 'jobs',
  JOB: 'job',
  APPLICATIONS: 'applications',
  MESSAGES: 'messages',
  SETTINGS: 'settings',
} as const;

/**
 * Helper to create user-specific cache keys
 * ✅ Prevents cache poisoning between users
 * 
 * @example
 * const getUserApplications = createPersistedQuery(
 *   async () => {...},
 *   createUserCacheKey(userId, 'applications'),
 *   { revalidate: CACHE_DURATION.SHORT }
 * );
 */
export function createUserCacheKey(userId: string, ...parts: string[]): string[] {
  return ['user', userId, ...parts];
}

/**
 * Type helper for cache options
 */
export type CacheConfig = {
  duration?: keyof typeof CACHE_DURATION;
  tags?: string[];
};

/**
 * Helper to convert CacheConfig to numeric seconds
 */
export function getCacheDuration(config?: CacheConfig): number | undefined {
  if (!config?.duration) return undefined;
  return CACHE_DURATION[config.duration];
}