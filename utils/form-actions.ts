"use server";

import { createClient } from "@/utils/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ==================== Storage Functions ====================

async function uploadCV(file: File) {
  const supabase = await createClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await supabase.storage
    .from('cvs')
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    console.error("❌ Upload error:", error);
    return null;
  }

  console.log("✅ CV uploaded successfully:", filePath);
  return filePath;
}

async function getCVUrl(filePath: string) {
  const supabase = await createClient();
  
  // Try signed URL first
  const { data: signedData, error: signedError } = await supabase.storage
    .from('cvs')
    .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days

  if (!signedError && signedData?.signedUrl) {
    console.log("✅ Signed URL generated");
    return signedData.signedUrl;
  }

  // Fallback to public URL
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
  userEmail: string
) {
  const results = {
    adminSent: false,
    userSent: false,
    errors: [] as string[]
  };

  // Send to Admin
  try {
    const adminResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.ADMIN_EMAIL!,
      subject: adminSubject,
      html: adminHtml,
    });
    console.log("✅ Admin email sent:", adminResult);
    results.adminSent = true;
  } catch (error) {
    console.error("❌ Admin email failed:", error);
    results.errors.push("Admin email failed");
  }

  // Send to User
  try {
    const userResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: userEmail,
      subject: userSubject,
      html: userHtml,
    });
    console.log("✅ User email sent:", userResult);
    results.userSent = true;
  } catch (error) {
    console.error("❌ User email failed:", error);
    results.errors.push("User email failed");
  }

  return results;
}

// ==================== Job Application ====================

export async function submitJobApplication(formData: FormData) {
  const supabase = await createClient();

  try {
    // Extract and validate data
    const data = {
      first_name: formData.get("firstName") as string,
      last_name: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      position: formData.get("position") as string,
      cover_letter: (formData.get("coverLetter") as string) || null,
      cv_url: null as string | null,
    };

    // Validation
    if (!data.first_name || !data.last_name || !data.email || !data.phone || !data.position) {
      return { error: "Please fill all required fields" };
    }

    // Handle CV Upload
    let cvUrl = null;
    const cvFile = formData.get("cv") as File;
    
    if (cvFile && cvFile.size > 0) {
      console.log("📤 Uploading CV...");
      const cvPath = await uploadCV(cvFile);
      
      if (!cvPath) {
        return { error: "Failed to upload CV. Please try again." };
      }
      
      data.cv_url = cvPath;
      cvUrl = await getCVUrl(cvPath);
      
      if (!cvUrl) {
        console.error("⚠️ Could not generate CV URL, but continuing...");
      }
    }

    // Save to Database
    console.log("💾 Saving to database...");
    const { error: dbError } = await supabase
      .from("job_applications")
      .insert([data]);

    if (dbError) {
      console.error("❌ Database error:", dbError);
      return { error: "Failed to submit application. Please try again." };
    }

    console.log("✅ Application saved to database");

    // Send Emails
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
      data.email
    );

    // Return success even if emails partially failed
    if (emailResults.errors.length > 0) {
      console.warn("⚠️ Some emails failed:", emailResults.errors);
    }

    return { 
      success: true,
      emailsSent: emailResults.adminSent && emailResults.userSent
    };

  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return { 
      error: "Something went wrong. Please try again.",
      details: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// ==================== Contact Message ====================

export async function submitContactMessage(formData: FormData) {
  const supabase = await createClient();

  const data = {
    first_name: formData.get("firstName") as string,
    last_name: formData.get("lastName") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  };

  // Validation
  if (!data.first_name || !data.last_name || !data.email || !data.subject || !data.message) {
    return { error: "Please fill all required fields" };
  }

  try {
    // Save to Database
    console.log("💾 Saving contact message...");
    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert([data]);

    if (dbError) {
      console.error("❌ Database error:", dbError);
      return { error: "Failed to send message. Please try again." };
    }

    console.log("✅ Contact message saved");

    // Send Emails
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
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Subject:</td>
              <td style="padding: 8px 0; color: #1e293b;">${data.subject}</td>
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
      data.email
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
    return { 
      error: "Something went wrong. Please try again.",
      details: error instanceof Error ? error.message : "Unknown error"
    };
  }
}