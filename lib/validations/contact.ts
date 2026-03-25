// lib/validations/contact.ts
import { z } from 'zod';

// Name validation helper
const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .trim();

// Phone validation (international format)
const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(20, 'Phone number is too long')
  .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number format')
  .trim();

// Contact form schema
export const contactFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email is too long')
    .toLowerCase()
    .trim(),
  subject: z
    .string()
    .min(1, 'Please select a subject')
    .max(100, 'Subject is too long'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message is too long (max 5000 characters)')
    .trim(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Job application schema
export const jobApplicationSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email is too long')
    .toLowerCase()
    .trim(),
  phone: phoneSchema,
  position: z
    .string()
    .min(1, 'Please select a position')
    .max(100, 'Position name is too long'),
  coverLetter: z
    .string()
    .max(2000, 'Cover letter is too long (max 2000 characters)')
    .trim()
    .optional(),
});

export type JobApplicationData = z.infer<typeof jobApplicationSchema>;

// File validation constants
export const FILE_VALIDATION = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
  MIME_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

// File validation function
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > FILE_VALIDATION.MAX_SIZE) {
    return {
      valid: false,
      error: 'File size must be less than 5MB',
    };
  }

if (!FILE_VALIDATION.MIME_TYPES.some(mime => mime === file.type)) {
  return {
    valid: false,
    error: 'Please upload PDF, DOC, or DOCX files only',
  };
}

  // Check file name
  const fileName = file.name;
  if (fileName.length > 255) {
    return {
      valid: false,
      error: 'File name is too long',
    };
  }

  // Check for suspicious file names
  if (/[<>:"|?*\x00-\x1f]/g.test(fileName)) {
    return {
      valid: false,
      error: 'File name contains invalid characters',
    };
  }

  return { valid: true };
}