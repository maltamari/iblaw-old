// lib/validations/job-listing.ts
import { z } from 'zod';

const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'internship'] as const;

// Schema for form input (before transform)
export const jobListingFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Job title must be at least 3 characters')
    .max(100, 'Job title is too long')
    .trim(),
  
  department: z
    .string()
    .min(2, 'Department must be at least 2 characters')
    .max(50, 'Department name is too long')
    .trim(),
  
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location is too long')
    .trim(),
  
  type: z.enum(EMPLOYMENT_TYPES, {
    message: 'Please select a valid employment type',
  }),
  
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description is too long')
    .trim(),
  
  requirements: z
    .string()
    .min(10, 'Requirements must be at least 10 characters')
    .max(2000, 'Requirements are too long')
    .trim()
    .refine(
      (val) => {
        const lines = val.split('\n').filter((line) => line.trim().length > 0);
        return lines.length > 0 && lines.length <= 20;
      },
      {
        message: 'Please provide 1-20 requirements (one per line)',
      }
    ),
});

// Helper function to parse requirements string into array
export function parseRequirements(requirements: string): string[] {
  return requirements
    .split('\n')
    .map((req) => req.trim())
    .filter((req) => req.length > 0);
}

// Helper function to format requirements array into string
export function formatRequirements(requirements: string[] | string): string {
  if (Array.isArray(requirements)) {
    return requirements.join('\n');
  }
  return requirements;
}

export type JobListingFormInput = z.infer<typeof jobListingFormSchema>;