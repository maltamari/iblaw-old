// app/api/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { downloadQuerySchema } from '@/lib/validations/download';
import { handleApiError, AppError } from '@/lib/validations/error-handler';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_CONTENT_TYPES = {
  vcard: 'text/vcard',
  pdf: 'application/pdf',
} as const;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const validatedData = downloadQuerySchema.parse({
      url: searchParams.get('url'),
      filename: searchParams.get('filename'),
      type: searchParams.get('type'),
    });

    const { url, filename, type } = validatedData;
    const inline = searchParams.get('inline') === 'true';

    // ✅ استخدام الـ URL مباشرة - Cloudinary handles authentication
    const finalUrl = url;

    // Fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let response: Response;
    try {
      response = await fetch(finalUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'IBLaw-App/1.0',
          'Accept': 'application/pdf,*/*',
        },
        // ✅ No credentials needed for public Cloudinary files
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new AppError('Download timeout - file took too long to fetch', 408);
      }
      throw new AppError('Failed to fetch file from source', 502);
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('Fetch failed:', {
        status: response.status,
        statusText: response.statusText,
        url: finalUrl,
      });
      
      throw new AppError(
        `Failed to fetch file: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const contentType = response.headers.get('content-type');
    if (type && contentType) {
      const expectedType = ALLOWED_CONTENT_TYPES[type];
      if (!contentType.includes(expectedType.split('/')[0])) {
        console.warn('Content type mismatch:', { expected: expectedType, received: contentType });
      }
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
      throw new AppError('File is too large (max 10MB)', 413);
    }

    const blob = await response.blob();

    if (blob.size > MAX_FILE_SIZE) {
      throw new AppError('File is too large (max 10MB)', 413);
    }

    const buffer = await blob.arrayBuffer();

    const headers = new Headers();
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    headers.set('Content-Security-Policy', "default-src 'none'; frame-ancestors 'self'");

    if (type === 'vcard') {
      headers.set('Content-Type', 'text/vcard; charset=utf-8');
      headers.set(
        'Content-Disposition',
        `attachment; filename="${filename || 'contact.vcf'}"`
      );
    } else if (type === 'pdf') {
      headers.set('Content-Type', 'application/pdf');
      const disposition = inline ? 'inline' : 'attachment';
      headers.set(
        'Content-Disposition',
        `${disposition}; filename="${filename || 'biography.pdf'}"`
      );
    } else {
      headers.set('Content-Type', 'application/octet-stream');
      headers.set(
        'Content-Disposition',
        `attachment; filename="${filename || 'download'}"`
      );
    }

    headers.set('Content-Length', buffer.byteLength.toString());
    headers.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

    return new NextResponse(buffer, { headers });
  } catch (error) {
    console.error('Download route error:', error);
    return handleApiError(error);
  }
}