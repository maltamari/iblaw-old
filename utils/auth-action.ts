// utils/auth-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { redis, redisHelpers } from "@/lib/redis";
import { logActivity } from "@/utils/audit";

// ✅ Rate limiting configuration
const AUTH_RATE_LIMIT = {
  LOGIN: {
    MAX_ATTEMPTS: 5,
    WINDOW_SECONDS: 900, // 15 minutes
    PREFIX: 'rate_limit:login:',
  },
  PASSWORD_RESET: {
    MAX_ATTEMPTS: 3,
    WINDOW_SECONDS: 3600, // 1 hour
    PREFIX: 'rate_limit:password_reset:',
  },
};

// ✅ Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * ✅ Redis-based rate limiting for auth operations
 */
async function checkAuthRateLimit(
  identifier: string,
  config: typeof AUTH_RATE_LIMIT.LOGIN
): Promise<{ allowed: boolean; waitTime?: number }> {
  const key = `${config.PREFIX}${identifier}`;
  
  try {
    const count = await redisHelpers.incrementWithExpiry(
      key,
      config.WINDOW_SECONDS
    );
    
    if (count > config.MAX_ATTEMPTS) {
      const ttl = await redisHelpers.getTTL(key);
      const waitTime = ttl > 0 ? ttl : config.WINDOW_SECONDS;
      return { allowed: false, waitTime };
    }
    
    return { allowed: true };
  } catch (error) {
    // Log but allow if Redis fails (graceful degradation)
    console.error('⚠️ Auth rate limit check failed (allowing request):', error);
    return { allowed: true };
  }
}

/**
 * ✅ Reset rate limit after successful operation
 */
async function resetAuthRateLimit(
  identifier: string,
  config: typeof AUTH_RATE_LIMIT.LOGIN
): Promise<void> {
  const key = `${config.PREFIX}${identifier}`;
  
  try {
    await redisHelpers.delete(key);
  } catch (error) {
    console.error('⚠️ Failed to reset rate limit:', error);
  }
}

/**
 * Validate email format
 */
function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= 254;
}

/**
 * Validate password strength
 */
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long" };
  }

  if (password.length > 128) {
    return { valid: false, error: "Password is too long" };
  }

  return { valid: true };
}

// ==================== Login ====================

/**
 * Login user
 * ✅ Redis-based rate limiting to prevent brute force
 * ✅ Validates email and password
 * ✅ Proper error handling
 * ✅ Audit logging
 */
export async function login(formData: FormData) {
  try {
    const email = (formData.get("email") as string)?.toLowerCase().trim();
    const password = formData.get("password") as string;

    // ✅ Basic validation
    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    // ✅ Validate email format
    if (!validateEmail(email)) {
      return { error: "Invalid email format" };
    }

    // ✅ Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { error: passwordValidation.error };
    }

    // ✅ Check rate limit (Redis)
    const rateLimitCheck = await checkAuthRateLimit(email, AUTH_RATE_LIMIT.LOGIN);
    if (!rateLimitCheck.allowed) {
      const minutes = Math.ceil(rateLimitCheck.waitTime! / 60);
      
      // ✅ Log failed login attempt (rate limited)
      await logActivity({
        action: 'login',
        resourceType: 'auth',
        resourceName: email,
        details: {
          success: false,
          reason: 'rate_limited',
          wait_time_seconds: rateLimitCheck.waitTime,
        },
      });

      return { 
        error: `Too many login attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.` 
      };
    }

    // ✅ Attempt login
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      
      // ✅ Log failed login attempt
      await logActivity({
        action: 'login',
        resourceType: 'auth',
        resourceName: email,
        details: {
          success: false,
          error: error.message,
          error_code: error.status,
        },
      });

      // ✅ Provide user-friendly error messages
      if (error.message.includes("Invalid login credentials")) {
        return { error: "Invalid email or password" };
      }
      
      if (error.message.includes("Email not confirmed")) {
        return { error: "Please verify your email address before logging in" };
      }

      return { error: "Login failed. Please try again." };
    }

    // ✅ Reset login attempts on success
    await resetAuthRateLimit(email, AUTH_RATE_LIMIT.LOGIN);

    // ✅ Log successful login
    await logActivity({
      action: 'login',
      resourceType: 'auth',
      resourceName: email,
      details: {
        success: true,
        user_id: data.user?.id,
      },
    });

    console.log("✅ User logged in successfully");

    // ✅ Revalidate and redirect
    revalidatePath("/", "layout");
    redirect("/dashboard");

  } catch (error) {
    // Handle redirect (Next.js throws error on redirect)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }

    console.error("❌ Unexpected login error:", error);
    return { 
      error: "An unexpected error occurred. Please try again." 
    };
  }
}

// ==================== Signout ====================

/**
 * Sign out user
 * ✅ Proper error handling
 * ✅ Clears session completely
 * ✅ Audit logging
 */
export async function signout() {
  try {
    const supabase = await createClient();
    
    // ✅ Get current user for logging
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email;
    
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Signout error:", error);
      
      // ✅ Log failed signout
      await logActivity({
        action: 'logout',
        resourceType: 'auth',
        resourceName: userEmail || 'Unknown',
        details: {
          success: false,
          error: error.message,
        },
      });

      return { error: "Failed to sign out. Please try again." };
    }

    // ✅ Log successful signout
    await logActivity({
      action: 'logout',
      resourceType: 'auth',
      resourceName: userEmail || 'Unknown',
      details: {
        success: true,
        user_id: user?.id,
      },
    });

    console.log("✅ User signed out successfully");

    // ✅ Revalidate and redirect
    revalidatePath("/", "layout");
    redirect("/");

  } catch (error) {
    // Handle redirect (Next.js throws error on redirect)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }

    console.error("❌ Unexpected signout error:", error);
    return { 
      error: "An unexpected error occurred. Please try again." 
    };
  }
}

// ==================== Password Reset ====================

/**
 * Request password reset
 * ✅ Validates email
 * ✅ Redis-based rate limiting
 * ✅ Secure flow (doesn't reveal if email exists)
 * ✅ Audit logging
 */
export async function requestPasswordReset(formData: FormData) {
  try {
    const email = (formData.get("email") as string)?.toLowerCase().trim();

    // ✅ Validate email
    if (!email) {
      return { error: "Email is required" };
    }

    if (!validateEmail(email)) {
      return { error: "Invalid email format" };
    }

    // ✅ Rate limiting (Redis)
    const rateLimitCheck = await checkAuthRateLimit(
      `reset-${email}`, 
      AUTH_RATE_LIMIT.PASSWORD_RESET
    );
    
    if (!rateLimitCheck.allowed) {
      const minutes = Math.ceil(rateLimitCheck.waitTime! / 60);
      
      // ✅ Log rate limited password reset
      await logActivity({
        action: 'update',
        resourceType: 'auth',
        resourceName: email,
        details: {
          operation: 'password_reset_request',
          success: false,
          reason: 'rate_limited',
          wait_time_seconds: rateLimitCheck.waitTime,
        },
      });

      return { 
        error: `Too many reset requests. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.` 
      };
    }

    const supabase = await createClient();
    
    // ✅ Request password reset
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });

    // ✅ Log password reset request (always log as success for security)
    await logActivity({
      action: 'update',
      resourceType: 'auth',
      resourceName: email,
      details: {
        operation: 'password_reset_request',
        success: true,
        // Don't log if email exists or not (security)
      },
    });

    if (error) {
      console.error("Password reset error:", error);
    }

    // ✅ Don't reveal if email exists (security best practice)
    return { 
      success: true, 
      message: "If an account exists with this email, you will receive a password reset link." 
    };

  } catch (error) {
    console.error("❌ Unexpected error in requestPasswordReset:", error);
    return { 
      error: "An unexpected error occurred. Please try again." 
    };
  }
}

/**
 * Update password (after reset)
 * ✅ Validates new password
 * ✅ Requires authentication
 * ✅ Audit logging
 */
export async function updatePassword(formData: FormData) {
  try {
    const newPassword = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // ✅ Validate passwords
    if (!newPassword || !confirmPassword) {
      return { error: "Both password fields are required" };
    }

    if (newPassword !== confirmPassword) {
      return { error: "Passwords do not match" };
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return { error: passwordValidation.error };
    }

    const supabase = await createClient();

    // ✅ Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: "You must be logged in to update your password" };
    }

    // ✅ Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Password update error:", error);
      
      // ✅ Log failed password update
      await logActivity({
        action: 'update',
        resourceType: 'auth',
        resourceName: user.email || 'Unknown',
        details: {
          operation: 'password_update',
          success: false,
          error: error.message,
        },
      });

      return { error: "Failed to update password. Please try again." };
    }

    // ✅ Log successful password update
    await logActivity({
      action: 'update',
      resourceType: 'auth',
      resourceName: user.email || 'Unknown',
      details: {
        operation: 'password_update',
        success: true,
        user_id: user.id,
      },
    });

    console.log("✅ Password updated successfully");

    return { 
      success: true, 
      message: "Password updated successfully" 
    };

  } catch (error) {
    console.error("❌ Unexpected error in updatePassword:", error);
    return { 
      error: "An unexpected error occurred. Please try again." 
    };
  }
}

/**
 * Check if user is authenticated
 * ✅ Useful for middleware and protection
 */
export async function checkAuth() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return { authenticated: false, user: null };
    }

    return { authenticated: true, user };

  } catch (error) {
    console.error("❌ Error checking auth:", error);
    return { authenticated: false, user: null };
  }
}

/**
 * ✅ Get remaining login attempts (useful for showing users)
 */
export async function getRemainingLoginAttempts(email: string) {
  try {
    const key = `${AUTH_RATE_LIMIT.LOGIN.PREFIX}${email}`;
    const count = await redis.get<number>(key) || 0;
    const remaining = Math.max(0, AUTH_RATE_LIMIT.LOGIN.MAX_ATTEMPTS - count);
    
    return { remaining, max: AUTH_RATE_LIMIT.LOGIN.MAX_ATTEMPTS };
  } catch (error) {
    console.error('Failed to get remaining attempts:', error);
    return { remaining: AUTH_RATE_LIMIT.LOGIN.MAX_ATTEMPTS, max: AUTH_RATE_LIMIT.LOGIN.MAX_ATTEMPTS };
  }
}