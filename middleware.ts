// middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { 
  authRateLimiter, 
  apiRateLimiter, 
  contactFormRateLimiter,
  jobApplicationRateLimiter
} from '@/lib/rate-limit';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ==================== 1. Rate Limiting by Endpoint Type ====================
  
  let rateLimitResult = null;
  
  // ✅ Auth endpoints - Strong protection against brute force
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/auth')) {
    rateLimitResult = await authRateLimiter.check(request);
  }
  // ✅ Job application endpoints - Prevent spam applications
  else if (pathname.includes('/api/job') || pathname.includes('job-application')) {
    rateLimitResult = await jobApplicationRateLimiter.check(request);
  }
  // ✅ Contact form - Prevent spam messages
  else if (pathname.includes('/api/contact') || pathname.includes('contact-message')) {
    rateLimitResult = await contactFormRateLimiter.check(request);
  }
  // ✅ Other API endpoints - General rate limiting
  else if (pathname.startsWith('/api/')) {
    rateLimitResult = await apiRateLimiter.check(request);
  }

  // ✅ If rate limit exceeded
  if (rateLimitResult && !rateLimitResult.success) {
    const retryAfter = Math.ceil((rateLimitResult.reset - Date.now()) / 1000);
    const minutesUntilReset = Math.ceil(retryAfter / 60);
    
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: `Rate limit exceeded. Please try again in ${minutesUntilReset} minute(s).`,
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
        },
      }
    );
  }

  // ==================== 2. Auth Protection for Dashboard ====================
  
  const response = await updateSession(request);

  // Check authentication for protected routes
  if (pathname.startsWith('/dashboard')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options) {
            request.cookies.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options) {
            request.cookies.set({ name, value: '', ...options });
            response.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    // If no session, redirect to login
    if (!session) {
      const redirectUrl = new URL('/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If logged in and trying to access login page, redirect to dashboard
  if (pathname === '/login') {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options) {
            request.cookies.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options) {
            request.cookies.set({ name, value: '', ...options });
            response.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      const redirectUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // ==================== 3. Security Headers ====================

  // Add rate limit headers to successful responses
  if (rateLimitResult) {
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.reset).toISOString());
  }

  // ==================== 4. Prevent Access to Sensitive Files ====================
  
  // ✅ Enhanced pattern matching with regex for better security
  const sensitivePaths = [
    /\.env/i,              // .env files
    /\.git/i,              // .git directory
    /\/\./,                // Hidden files (starting with .)
    /\.map$/i,             // Source maps
    /\.config\.(js|ts)$/i, // Config files
    /package(-lock)?\.json$/i, // Package files
    /tsconfig\.json$/i,    // TypeScript config
  ];

  const isSensitivePath = sensitivePaths.some(pattern => pattern.test(pathname));

  if (isSensitivePath) {
    console.warn(`🚨 Attempted access to sensitive file: ${pathname}`);
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );
  }

  // ==================== 5. Additional Security Headers ====================
  
  // Add security headers to all responses
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Only add HSTS in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files with common extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
  ],
};