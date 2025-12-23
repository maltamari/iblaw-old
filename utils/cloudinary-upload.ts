"use server";

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload Image
export async function uploadToCloudinary(file: File) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'team-photos',
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      error: null,
    };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return {
      url: null,
      publicId: null,
      error: error.message || 'Upload failed',
    };
  }
}

// ✅ Upload vCard (VCF file)
export async function uploadVCardToCloudinary(file: File) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'team-vcards',
      resource_type: 'raw',
      public_id: `contact-${Date.now()}`,
      type: 'upload',
      access_mode: 'public',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      error: null,
    };
  } catch (error: any) {
    console.error('vCard upload error:', error);
    return {
      url: null,
      publicId: null,
      error: error.message || 'Upload failed',
    };
  }
}

// ✅ Upload PDF
export async function uploadPDFToCloudinary(file: File) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'team-bios',
      resource_type: 'raw',
      public_id: `biography-${Date.now()}`,
      type: 'upload',
      access_mode: 'public',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      error: null,
    };
  } catch (error: any) {
    console.error('PDF upload error:', error);
    return {
      url: null,
      publicId: null,
      error: error.message || 'Upload failed',
    };
  }
}

// ✅ Delete any file
export async function deleteFromCloudinary(publicId: string) {
  try {
    // Try as image first
    let result = await cloudinary.uploader.destroy(publicId);
    
    // If failed, try as raw file (PDF/vCard)
    if (result.result !== 'ok') {
      result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw'
      });
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Cloudinary delete error:', error);
    return { success: false, error: error.message };
  }
}