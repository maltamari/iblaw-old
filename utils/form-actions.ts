"use server";

import { createClient } from "@/utils/supabase/server";
import { Resend } from "resend";
import { SUBJECT_OPTIONS } from "@/lib/constants";
import { redisHelpers } from "@/lib/redis";

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Rate limiting configuration for forms
const FORM_RATE_LIMIT = {
  JOB_APPLICATION: {
    MAX_REQUESTS: 3,      // 3 applications per hour
    WINDOW_SECONDS: 3600, // 1 hour
    PREFIX: 'rate_limit:job_application:',
  },
  CONTACT_MESSAGE: {
    MAX_REQUESTS: 5,      // 5 messages per hour
    WINDOW_SECONDS: 3600, // 1 hour
    PREFIX: 'rate_limit:contact_message:',
  },
};

/**
 * ✅ Rate limit check for forms (by IP or email)
 */
async function checkFormRateLimit(
  identifier: string, 
  config: typeof FORM_RATE_LIMIT.JOB_APPLICATION
): Promise<void> {
  const key = `${config.PREFIX}${identifier}`;
  
  try {
    const count = await redisHelpers.incrementWithExpiry(
      key, 
      config.WINDOW_SECONDS
    );
    
    if (count > config.MAX_REQUESTS) {
      const ttl = await redisHelpers.getTTL(key);
      const waitTime = ttl > 0 ? ttl : config.WINDOW_SECONDS;
      const minutes = Math.ceil(waitTime / 60);
      
      throw new Error(
        `Too many submissions. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Too many submissions')) {
      throw error;
    }
    // Log but allow if Redis fails
    console.error('⚠️ Form rate limit check failed (allowing request):', error);
  }
}

// ==================== Get Target Email for Subject ====================
async function getEmailForSubject(subjectKey: string): Promise<string> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('subject_email_mappings')
    .select('email')
    .eq('subject_key', subjectKey)
    .single();
  
  if (error || !data) {
    console.warn(`⚠️ No email mapping found for ${subjectKey}, using default`);
    return process.env.ADMIN_EMAIL || 'info@iblaw.com';
  }
  
  return data.email;
}

// ==================== Storage Functions ====================

async function uploadCV(file: File) {
  const supabase = await createClient();
  
  console.log("📁 File details:", {
    name: file.name,
    type: file.type,
    size: file.size
  });
  
  // ✅ Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('CV file must be less than 5MB');
  }

  // ✅ Validate file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('CV must be PDF or Word document');
  }
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("📦 Buffer created, size:", buffer.length);

    const { error } = await supabase.storage
      .from('cvs')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error("❌ Upload error:", error);
      throw new Error('Failed to upload CV');
    }

    console.log("✅ CV uploaded successfully:", filePath);
    return filePath;
  } catch (err) {
    console.error("❌ Exception during upload:", err);
    throw err;
  }
}

async function getCVUrl(filePath: string) {
  const supabase = await createClient();
  
  const { data: signedData, error: signedError } = await supabase.storage
    .from('cvs')
    .createSignedUrl(filePath, 60 * 60 * 24 * 7);

  if (!signedError && signedData?.signedUrl) {
    console.log("✅ Signed URL generated");
    return signedData.signedUrl;
  }

  console.log("⚠️ Signed URL failed, using public URL");
  const { data: publicData } = supabase.storage
    .from('cvs')
    .getPublicUrl(filePath);
  
  return publicData.publicUrl;
}

// ==================== Email Sending ====================

async function sendEmails(
  adminHtml: string,
  userHtml: string,
  adminSubject: string,
  userSubject: string,
  userEmail: string,
  adminEmail: string
) {
  const results = {
    adminSent: false,
    userSent: false,
    errors: [] as string[]
  };

  // ✅ Send to Admin (or Department Email)
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: adminEmail,
      subject: adminSubject,
      html: adminHtml,
    });
    results.adminSent = true;
    console.log("✅ Admin email sent successfully");
  } catch (error) {
    console.error("❌ Admin email failed:", error);
    results.errors.push("Admin email failed");
  }

  // ✅ Send to User
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: userEmail,
      subject: userSubject,
      html: userHtml,
    });
    results.userSent = true;
    console.log("✅ User email sent successfully");
  } catch (error) {
    console.error("❌ User email failed:", error);
    results.errors.push("User email failed");
  }

  return results;
}

// ==================== Validation Helpers ====================

/**
 * ✅ Validate email format
 */
function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) && email.length <= 254;
}

/**
 * ✅ Validate phone format
 */
function validatePhone(phone: string): boolean {
  const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return regex.test(phone) && phone.length >= 7 && phone.length <= 20;
}

/**
 * ✅ Validate name
 */
function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

// ==================== Job Application ====================

export async function submitJobApplication(formData: FormData) {
  const supabase = await createClient();

  try {
    const data = {
      first_name: (formData.get("firstName") as string)?.trim(),
      last_name: (formData.get("lastName") as string)?.trim(),
      email: (formData.get("email") as string)?.trim(),
      phone: (formData.get("phone") as string)?.trim(),
      position: (formData.get("position") as string)?.trim(),
      cover_letter: (formData.get("coverLetter") as string)?.trim() || null,
      cv_url: null as string | null,
    };

    // ✅ Validation
    if (!data.first_name || !data.last_name || !data.email || !data.phone || !data.position) {
      return { error: "Please fill all required fields" };
    }

    if (!validateName(data.first_name) || !validateName(data.last_name)) {
      return { error: "Names must be 2-100 characters" };
    }

    if (!validateEmail(data.email)) {
      return { error: "Invalid email format" };
    }

    if (!validatePhone(data.phone)) {
      return { error: "Invalid phone number" };
    }

    if (data.cover_letter && data.cover_letter.length > 5000) {
      return { error: "Cover letter is too long (max 5000 characters)" };
    }

    // ✅ Rate limiting (by email)
    await checkFormRateLimit(data.email, FORM_RATE_LIMIT.JOB_APPLICATION);

    let cvUrl = null;
    const cvFile = formData.get("cv") as File;
    
    if (cvFile && cvFile.size > 0) {
      console.log("📤 Uploading CV...");
      
      try {
        const cvPath = await uploadCV(cvFile);
        data.cv_url = cvPath;
        cvUrl = await getCVUrl(cvPath);
      } catch (uploadError) {
        const message = uploadError instanceof Error ? uploadError.message : 'Upload failed';
        return { error: message };
      }
    }

    console.log("💾 Saving to database...");
    const { error: dbError } = await supabase
      .from("job_applications")
      .insert([data]);

    if (dbError) {
      console.error("❌ Database error:", dbError);
      return { error: "Failed to submit application. Please try again." };
    }

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px;">
          New Job Application Received
        </h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 140px;">Name:</td>
              <td style="padding: 8px 0; color: #1e293b;">${data.first_name} ${data.last_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Email:</td>
              <td style="padding: 8px 0;">
                <a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">${data.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Phone:</td>
              <td style="padding: 8px 0; color: #1e293b;">${data.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Position:</td>
              <td style="padding: 8px 0; color: #1e293b;">
                <span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 4px; font-weight: 500;">
                  ${data.position}
                </span>
              </td>
            </tr>
          </table>
        </div>
        
        ${data.cover_letter ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #1e293b; font-size: 16px; margin-bottom: 10px;">Cover Letter:</h3>
            <div style="background: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <p style="color: #475569; line-height: 1.6; white-space: pre-wrap; margin: 0;">${data.cover_letter}</p>
            </div>
          </div>
        ` : ''}
        
        ${cvUrl ? `
          <div style="margin: 30px 0; text-align: center;">
            <a href="${cvUrl}" 
               style="display: inline-block; background: #2563eb; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500; 
                      box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
              📄 Download CV
            </a>
            <p style="color: #64748b; font-size: 12px; margin-top: 8px;">
              Link expires in 7 days
            </p>
          </div>
        ` : ''}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
          <p>This is an automated notification from your job application system.</p>
        </div>
      </div>
    `;

    const userHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">Thank You for Applying!</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 25px; border-radius: 8px; border-left: 4px solid #2563eb;">
          <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
            Dear <strong>${data.first_name} ${data.last_name}</strong>,
          </p>
          
          <p style="color: #475569; line-height: 1.6; margin: 0 0 15px 0;">
            We have received your application for the <strong style="color: #2563eb;">${data.position}</strong> position at IBLAW.
          </p>
          
          <p style="color: #475569; line-height: 1.6; margin: 0;">
            Our recruitment team will carefully review your credentials and get back to you soon.
          </p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #dbeafe; border-radius: 8px; text-align: center;">
          <p style="color: #1e40af; margin: 0; font-size: 14px;">
            💼 Application submitted successfully
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #475569; margin: 0;">
            Best regards,<br>
            <strong style="color: #1e293b;">IBLAW Recruitment Team</strong>
          </p>
        </div>
      </div>
    `;

    const emailResults = await sendEmails(
      adminHtml,
      userHtml,
      `New Job Application: ${data.position}`,
      "Thank you for your application - IBLAW",
      data.email,
      process.env.ADMIN_EMAIL!
    );

    if (emailResults.errors.length > 0) {
      console.warn("⚠️ Some emails failed:", emailResults.errors);
    }

    return { 
      success: true,
      emailsSent: emailResults.adminSent && emailResults.userSent
    };

  } catch (error) {
    console.error("❌ Unexpected error:", error);
    
    if (error instanceof Error && error.message.includes('Too many submissions')) {
      return { error: error.message };
    }
    
    return { 
      error: "Something went wrong. Please try again.",
      details: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// ==================== Contact Message ====================

export async function submitContactMessage(formData: FormData) {
  const supabase = await createClient();

  try {
    const subjectKey = formData.get("subject") as string;
    
    const subjectOption = SUBJECT_OPTIONS.find(opt => opt.value === subjectKey);
    const subjectLabel = subjectOption?.label || subjectKey;

    const data = {
      first_name: (formData.get("firstName") as string)?.trim(),
      last_name: (formData.get("lastName") as string)?.trim(),
      email: (formData.get("email") as string)?.trim(),
      subject: subjectLabel,
      subject_key: subjectKey,
      message: (formData.get("message") as string)?.trim(),
    };

    // ✅ Validation
    if (!data.first_name || !data.last_name || !data.email || !data.subject || !data.message) {
      return { error: "Please fill all required fields" };
    }

    if (!validateName(data.first_name) || !validateName(data.last_name)) {
      return { error: "Names must be 2-100 characters" };
    }

    if (!validateEmail(data.email)) {
      return { error: "Invalid email format" };
    }

    if (data.message.length < 10 || data.message.length > 5000) {
      return { error: "Message must be 10-5000 characters" };
    }

    // ✅ Rate limiting (by email)
    await checkFormRateLimit(data.email, FORM_RATE_LIMIT.CONTACT_MESSAGE);

    const targetEmail = await getEmailForSubject(subjectKey);
    console.log(`📧 Routing to: ${targetEmail} for subject: ${subjectLabel}`);

    console.log("💾 Saving contact message...");
    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert([data]);

    if (dbError) {
      console.error("❌ Database error:", dbError);
      return { error: "Failed to send message. Please try again." };
    }

    console.log("✅ Contact message saved");

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px;">
          New Contact Message
        </h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 120px;">Name:</td>
              <td style="padding: 8px 0; color: #1e293b;">${data.first_name} ${data.last_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Email:</td>
              <td style="padding: 8px 0;">
                <a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">${data.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Category:</td>
              <td style="padding: 8px 0;">
                <span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 4px; font-weight: 500;">
                  ${data.subject}
                </span>
              </td>
            </tr>
          </table>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #1e293b; font-size: 16px; margin-bottom: 10px;">Message:</h3>
          <div style="background: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <p style="color: #475569; line-height: 1.6; white-space: pre-wrap; margin: 0;">${data.message}</p>
          </div>
        </div>
      </div>
    `;

    const userHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">Thank You for Your Message!</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 25px; border-radius: 8px; border-left: 4px solid #2563eb;">
          <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
            Dear <strong>${data.first_name} ${data.last_name}</strong>,
          </p>
          
          <p style="color: #475569; line-height: 1.6; margin: 0 0 15px 0;">
            We have received your message regarding: <strong style="color: #2563eb;">${data.subject}</strong>
          </p>
          
          <p style="color: #475569; line-height: 1.6; margin: 0;">
            Our team will review your inquiry and get back to you as soon as possible.
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #475569; margin: 0;">
            Best regards,<br>
            <strong style="color: #1e293b;">IBLAW Team</strong>
          </p>
        </div>
      </div>
    `;

    const emailResults = await sendEmails(
      adminHtml,
      userHtml,
      `New Contact Message: ${data.subject}`,
      "Thank you for contacting IBLAW",
      data.email,
      targetEmail
    );

    if (emailResults.errors.length > 0) {
      console.warn("⚠️ Some emails failed:", emailResults.errors);
    }

    return { 
      success: true,
      emailsSent: emailResults.adminSent && emailResults.userSent
    };

  } catch (error) {
    console.error("❌ Unexpected error:", error);
    
    if (error instanceof Error && error.message.includes('Too many submissions')) {
      return { error: error.message };
    }
    
    return { 
      error: "Something went wrong. Please try again.",
      details: error instanceof Error ? error.message : "Unknown error"
    };
  }
}