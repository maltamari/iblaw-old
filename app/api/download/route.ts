// ==================== 📁 app/api/download/route.ts ====================
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    const filename = searchParams.get('filename');
    const type = searchParams.get('type'); // 'vcard' or 'pdf'

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Fetch the file from Cloudinary
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
    }

    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    // Set the correct headers for download
    const headers = new Headers();
    
    if (type === 'vcard') {
      headers.set('Content-Type', 'text/vcard');
      headers.set('Content-Disposition', `attachment; filename="${filename || 'contact.vcf'}"`);
    } else if (type === 'pdf') {
      headers.set('Content-Type', 'application/pdf');
      headers.set('Content-Disposition', `attachment; filename="${filename || 'biography.pdf'}"`);
    } else {
      headers.set('Content-Disposition', `attachment; filename="${filename || 'download'}"`);
    }

    return new NextResponse(buffer, { headers });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}