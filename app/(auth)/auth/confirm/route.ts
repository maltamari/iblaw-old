// app/(auth)/auth/confirm/route.ts
import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { otpVerificationSchema } from '@/lib/validations/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate input
    const validatedData = otpVerificationSchema.parse({
      token_hash: searchParams.get('token_hash'),
      type: searchParams.get('type'),
      next: searchParams.get('next'),
    });

    const { token_hash, type, next } = validatedData;

    // Create redirect URL
    const redirectTo = request.nextUrl.clone();
    redirectTo.pathname = next;
    redirectTo.searchParams.delete('token_hash');
    redirectTo.searchParams.delete('type');
    redirectTo.searchParams.delete('next');

    // Verify OTP
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash,
    });

    if (error) {
      console.error('OTP verification failed:', error.message);
      
      // Redirect to error page with safe message
      const errorUrl = request.nextUrl.clone();
      errorUrl.pathname = '/error';
      errorUrl.searchParams.set('message', 'verification_failed');
      return NextResponse.redirect(errorUrl);
    }

    // Success - redirect to intended destination
    return NextResponse.redirect(redirectTo);
  } catch (error) {
    console.error('Auth confirm error:', error);
    
    // Redirect to error page for any validation or unexpected errors
    const errorUrl = request.nextUrl.clone();
    errorUrl.pathname = '/error';
    errorUrl.searchParams.set('message', 'invalid_request');
    return NextResponse.redirect(errorUrl);
  }
}