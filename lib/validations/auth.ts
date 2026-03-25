// lib/validations/auth.ts
import { z } from 'zod';

// Email validation
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(255, 'Email is too long')
  .toLowerCase()
  .trim();

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain uppercase, lowercase, number and special character'
  );

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'), // لا نحط قيود على login password
});

// Signup schema
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// OTP verification schema
export const otpVerificationSchema = z.object({
  token_hash: z
    .string()
    .min(1, 'Token is required')
    .max(500, 'Invalid token'),
  
  type: z.enum(['signup', 'recovery', 'email_change', 'email'], {
    message: 'Invalid OTP type',
  }),
  
  next: z
    .string()
    .regex(/^\/[a-zA-Z0-9-_/]*$/, 'Invalid redirect path')
    .max(255, 'Redirect path is too long')
    .optional()
    .default('/'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type OtpVerification = z.infer<typeof otpVerificationSchema>;