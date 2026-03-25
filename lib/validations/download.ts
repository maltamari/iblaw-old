// lib/validations/download.ts
import { z } from 'zod';

// Allowed file types
const ALLOWED_DOWNLOAD_TYPES = ['vcard', 'pdf'] as const;

// Cloudinary URL pattern
const CLOUDINARY_URL_PATTERN = /^https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9-_]+\/.*$/;

export const downloadQuerySchema = z.object({
  url: z
    .string()
    .min(1, 'URL is required')
    .url('Invalid URL format')
    .regex(CLOUDINARY_URL_PATTERN, 'Only Cloudinary URLs are allowed')
    .max(500, 'URL is too long'),
  
  filename: z
    .string()
    .min(1, 'Filename is required')
    .max(255, 'Filename is too long')
    .regex(/^[a-zA-Z0-9-_. ]+$/, 'Filename contains invalid characters')
    .optional(),
  
  type: z
    .enum(ALLOWED_DOWNLOAD_TYPES, {
      message: 'Type must be either "vcard" or "pdf"',
    })
    .optional(),
});

export type DownloadQuery = z.infer<typeof downloadQuerySchema>;