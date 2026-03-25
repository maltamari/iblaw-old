// lib/validations/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // ✅ Supabase (Required)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Must be a valid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Service role key is required').optional(),

  // ✅ Cloudinary (Optional but with strong validation)
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string().min(1).optional(),

  // ✅ Email Service (Required - was missing!)
  RESEND_API_KEY: z.string()
    .min(1, 'Resend API key is required')
    .startsWith('re_', 'Resend API key must start with re_'),
  RESEND_FROM_EMAIL: z.string()
    .email('Sender email must be valid'),
  ADMIN_EMAIL: z.string()
    .email('Admin email must be valid'),

  // ✅ SMTP (Optional - for alternatives)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM_EMAIL: z.string().email().optional(),

  // ✅ Upstash Redis (for Rate Limiting)
  UPSTASH_REDIS_REST_URL: z.string().url('Must be a valid Upstash Redis URL').optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, 'Upstash Redis token is required').optional(),

  // ✅ App Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_SITE_URL: z.string().url('Must be a valid site URL').optional(),
});

// TypeScript type for validated environment
export type ValidatedEnv = z.infer<typeof envSchema>;

/**
 * ✅ Validates environment variables
 * Called at application startup to ensure all required variables exist
 */
export function validateEnv(): ValidatedEnv {
  try {
    const validatedEnv = envSchema.parse(process.env);
    
    // ✅ Success message in development only
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Environment variables validated successfully');
    }
    
    return validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      console.error(JSON.stringify(error.issues, null, 2));
      
      // Display missing variables clearly
      const missingVars = error.issues
        .filter(err => err.code === 'invalid_type')
        .map(err => err.path.join('.'));
      
      if (missingVars.length > 0) {
        console.error('\n🔴 Missing variables:', missingVars.join(', '));
      }
    }
    
    // Stop the application if validation fails
    throw new Error('Environment variable validation failed - check your .env.local file');
  }
}

/**
 * ✅ Get validated environment variables (use this instead of process.env)
 * Example: const { RESEND_API_KEY } = getEnv();
 */
let cachedEnv: ValidatedEnv | null = null;

export function getEnv(): ValidatedEnv {
  if (!cachedEnv) {
    cachedEnv = validateEnv();
  }
  return cachedEnv;
}

/**
 * ✅ Check if a specific variable exists (for conditional usage)
 */
export function hasEnvVar(key: keyof ValidatedEnv): boolean {
  const env = getEnv();
  return env[key] !== undefined && env[key] !== null && env[key] !== '';
}