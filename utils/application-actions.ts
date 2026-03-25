// utils/application-actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { createCachedQuery, createPersistedQuery, CACHE_DURATION, CACHE_TAGS } from "@/lib/cache";
import { logActivity } from "@/utils/audit";

// ==================== TYPES ====================

export interface JobApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  position: string;
  cover_letter?: string;
  cv_url: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  created_at: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ==================== RATE LIMITING ====================

/**
 * Rate limiting storage for CV downloads
 * Structure: Map<userId, { count: number, resetAt: number }>
 */
const cvDownloadRateLimits = new Map<string, { count: number; resetAt: number }>();

/**
 * ✅ Rate limiter for CV downloads
 * Limits: 10 downloads per 15 minutes per user
 */
async function checkCVDownloadRateLimit(userId: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  const now = Date.now();
  const limit = 10;
  const windowMs = 15 * 60 * 1000;

  const userLimit = cvDownloadRateLimits.get(userId);

  if (!userLimit || now > userLimit.resetAt) {
    cvDownloadRateLimits.set(userId, {
      count: 1,
      resetAt: now + windowMs
    });
    return { allowed: true };
  }

  if (userLimit.count >= limit) {
    const retryAfter = Math.ceil((userLimit.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  userLimit.count++;
  cvDownloadRateLimits.set(userId, userLimit);
  
  return { allowed: true };
}

/**
 * ✅ Cleanup old rate limit entries
 */
setInterval(() => {
  const now = Date.now();
  for (const [userId, limit] of cvDownloadRateLimits.entries()) {
    if (now > limit.resetAt) {
      cvDownloadRateLimits.delete(userId);
    }
  }
}, 60 * 60 * 1000);

// ==================== HELPERS ====================

/**
 * ✅ UUID validation
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateUUID(id: string): boolean {
  return UUID_REGEX.test(id);
}

/**
 * Check authentication
 */
async function requireAuth() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized: Authentication required");
  }

  return { supabase, user };
}

/**
 * ✅ Efficient revalidation for applications
 */
function revalidateApplicationData() {
  try {
    revalidateTag(CACHE_TAGS.APPLICATIONS, 'default');
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/applications");
  } catch (error) {
    console.error("⚠️ Revalidation failed:", error);
  }
}

/**
 * ✅ Efficient revalidation for messages
 */
function revalidateMessageData() {
  try {
    revalidateTag(CACHE_TAGS.MESSAGES, 'default');
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/messages");
  } catch (error) {
    console.error("⚠️ Revalidation failed:", error);
  }
}

// ==================== READ OPERATIONS (Cached) ====================

/**
 * Get all job applications with caching
 * ✅ Updated to match actual database schema
 */
export const getJobApplications = createCachedQuery(
  async () => {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { data: null, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("job_applications")
      .select("id, full_name, email, phone, position, cover_letter, cv_url, status, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  }
);

/**
 * Get single application by ID
 * ✅ Updated to match actual database schema
 */
export const getApplicationById = createCachedQuery(
  async (id: string) => {
    if (!validateUUID(id)) {
      return { data: null, error: "Invalid application ID" };
    }

    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { data: null, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("job_applications")
      .select("id, first_name,last_name, email, phone, position, cover_letter, cv_url, status, created_at")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching application:", error);
      return { data: null, error: error.message };
    }

    return { data: data as JobApplication, error: null };
  }
);

/**
 * Get all contact messages with caching
 */
export const getContactMessages = createCachedQuery(
  async (unreadOnly: boolean = false) => {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { data: null, error: "Unauthorized" };
    }

    let query = supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (unreadOnly) {
      query = query.eq("is_read", false);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching messages:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  }
);

/**
 * Get unread message count
 */
export const getUnreadMessageCount = createPersistedQuery(
  async () => {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { count: 0, error: "Unauthorized" };
    }

    const { count, error } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false);

    if (error) {
      console.error("Error counting unread messages:", error);
      return { count: 0, error: error.message };
    }

    return { count: count || 0, error: null };
  },
  ['unread-messages-count'],
  {
    revalidate: CACHE_DURATION.SHORT,
    tags: [CACHE_TAGS.MESSAGES]
  }
);

/**
 * Get application statistics
 */
export const getApplicationStats = createPersistedQuery(
  async () => {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { data: null, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("job_applications")
      .select("status");

    if (error) {
      console.error("Error fetching application stats:", error);
      return { data: null, error: error.message };
    }

    const stats = {
      total: data.length,
      pending: data.filter(app => app.status === 'pending').length,
      reviewed: data.filter(app => app.status === 'reviewed').length,
      accepted: data.filter(app => app.status === 'accepted').length,
      rejected: data.filter(app => app.status === 'rejected').length,
    };

    return { data: stats, error: null };
  },
  ['application-stats'],
  {
    revalidate: CACHE_DURATION.MEDIUM,
    tags: [CACHE_TAGS.APPLICATIONS]
  }
);

// ==================== WRITE OPERATIONS (Protected) ====================

/**
 * Delete application
 * ✅ Updated to match actual database schema
 */
export async function deleteApplication(id: string) {
  try {
    if (!validateUUID(id)) {
      return { error: "Invalid application ID" };
    }

    const { supabase } = await requireAuth();

    const { data: application, error: fetchError } = await supabase
      .from("job_applications")
      .select("cv_url, first_name,last_name, email, position")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching application:", fetchError);
      return { error: fetchError.message };
    }

    if (!application) {
      return { error: "Application not found" };
    }

    const { error: deleteError } = await supabase
      .from("job_applications")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting application:", deleteError);
      return { error: deleteError.message };
    }

    if (application.cv_url) {
      const { error: storageError } = await supabase.storage
        .from("cvs")
        .remove([application.cv_url]);

      if (storageError) {
        console.error("⚠️ Error deleting CV file:", storageError);
      }
    }

    await logActivity({
      action: 'delete',
      resourceType: 'application',
      resourceId: id,
      resourceName: `${application.first_name} - ${application.last_name} - ${application.position}`,
      details: {
        applicant_email: application.email,
        position: application.position,
        cv_deleted: !!application.cv_url,
      },
    });

    revalidateApplicationData();

    return { success: true };

  } catch (error) {
    console.error("❌ Unexpected error in deleteApplication:", error);
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}

/**
 * Update application status
 * ✅ Updated to match actual database schema
 */
export async function updateApplicationStatus(
  id: string,
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted'
) {
  try {
    if (!validateUUID(id)) {
      return { error: "Invalid application ID" };
    }

    const validStatuses = ['pending', 'reviewed', 'rejected', 'accepted'];
    if (!validStatuses.includes(status)) {
      return { error: "Invalid status value" };
    }

    const { supabase } = await requireAuth();

    const { data: application } = await supabase
      .from("job_applications")
      .select("first_name, position, status")
      .eq("id", id)
      .single();

    const oldStatus = application?.status;

    const { error } = await supabase
      .from("job_applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating application status:", error);
      return { error: error.message };
    }

    await logActivity({
      action: 'update',
      resourceType: 'application',
      resourceId: id,
      resourceName: `${application?.first_name || 'Unknown'} - ${application?.position || 'Unknown Position'}`,
      details: {
        field_updated: 'status',
        old_value: oldStatus,
        new_value: status,
        position: application?.position,
      },
    });

    revalidateApplicationData();

    return { success: true };

  } catch (error) {
    console.error("❌ Unexpected error in updateApplicationStatus:", error);
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}

/**
 * Get signed URL for CV download
 * ✅ Full security implementation with rate limiting
 */
export async function getSignedCVUrl(cvPath: string) {
  try {
    if (!cvPath || cvPath.trim().length === 0) {
      return { data: null, error: "Invalid CV path" };
    }

    if (cvPath.includes('..') || cvPath.includes('//')) {
      console.warn(`🚨 Path traversal attempt detected: ${cvPath}`);
      return { data: null, error: "Invalid CV path format" };
    }

    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = cvPath.toLowerCase().slice(cvPath.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
      console.warn(`🚨 Invalid file type attempt: ${cvPath}`);
      return { data: null, error: "Invalid file type. Only PDF and Word documents are allowed." };
    }

    const { supabase, user } = await requireAuth();

    const rateLimitCheck = await checkCVDownloadRateLimit(user.id);
    
    if (!rateLimitCheck.allowed) {
      console.warn(`🚨 Rate limit exceeded for user: ${user.id}`);
      
      await logActivity({
        action: 'download',
        resourceType: 'application',
        resourceName: 'CV Download - Rate Limit Exceeded',
        details: {
          file_path: cvPath,
          retry_after_seconds: rateLimitCheck.retryAfter,
          status: 'blocked',
        },
      });

      return { 
        data: null, 
        error: `Too many download requests. Please try again in ${rateLimitCheck.retryAfter} seconds.` 
      };
    }

    const { data: validApplication, error: verificationError } = await supabase
      .from("job_applications")
      .select("id, full_name, email, position")
      .eq("cv_url", cvPath)
      .single();

    if (verificationError || !validApplication) {
      console.warn(`🚨 Potential IDOR attempt or orphaned file: ${cvPath} by user ${user.id}`);
      
      await logActivity({
        action: 'download',
        resourceType: 'application',
        resourceName: 'CV Download - Unauthorized Access Attempt',
        details: {
          file_path: cvPath,
          status: 'denied',
          reason: 'File not found or not associated with valid application',
        },
      });

      return { data: null, error: "File not found or access denied" };
    }

    const { data, error } = await supabase.storage
      .from("cvs")
      .createSignedUrl(cvPath, 60);

    if (error) {
      console.error("Storage error creating signed URL:", error);
      return { data: null, error: "Failed to generate download link" };
    }

    await logActivity({
      action: 'download',
      resourceType: 'application',
      resourceId: validApplication.id,
      resourceName: `CV: ${validApplication.full_name} - ${validApplication.position}`,
      details: {
        file_path: cvPath,
        applicant_email: validApplication.email,
        position: validApplication.position,
        file_type: fileExtension,
        status: 'success',
      },
    });

    console.log(`✅ CV download authorized for ${validApplication.full_name} by user ${user.id}`);

    return { data: data.signedUrl, error: null };

  } catch (error) {
    console.error("❌ Unexpected error in getSignedCVUrl:", error);
    
    try {
      await logActivity({
        action: 'download',
        resourceType: 'application',
        resourceName: 'CV Download - System Error',
        details: {
          error_message: error instanceof Error ? error.message : 'Unknown error',
          file_path: cvPath,
          status: 'error',
        },
      });
    } catch (logError) {
      console.error("Failed to log error activity:", logError);
    }

    return {
      data: null,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}

/**
 * Delete contact message
 */
export async function deleteMessage(id: string) {
  try {
    if (!validateUUID(id)) {
      return { error: "Invalid message ID" };
    }

    const { supabase } = await requireAuth();

    const { data: message } = await supabase
      .from("contact_messages")
      .select("first_name, last_name, email, subject")
      .eq("id", id)
      .single();

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting message:", error);
      return { error: error.message };
    }

    await logActivity({
      action: 'delete',
      resourceType: 'message',
      resourceId: id,
      resourceName: `${message?.first_name} ${message?.last_name} - ${message?.subject || 'No subject'}`,
      details: {
        sender_email: message?.email,
      },
    });

    revalidateMessageData();

    return { success: true };

  } catch (error) {
    console.error("❌ Unexpected error in deleteMessage:", error);
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(id: string) {
  try {
    if (!validateUUID(id)) {
      return { error: "Invalid message ID" };
    }

    const { supabase } = await requireAuth();

    const { data: message } = await supabase
      .from("contact_messages")
      .select("first_name, last_name, subject, is_read")
      .eq("id", id)
      .single();

    if (message?.is_read) {
      return { success: true };
    }

    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      console.error("Error marking message as read:", error);
      return { error: error.message };
    }

    await logActivity({
      action: 'update',
      resourceType: 'message',
      resourceId: id,
      resourceName: `${message?.first_name} ${message?.last_name} - ${message?.subject || 'No subject'}`,
      details: {
        field_updated: 'is_read',
        old_value: false,
        new_value: true,
      },
    });

    revalidateMessageData();

    return { success: true };

  } catch (error) {
    console.error("❌ Unexpected error in markMessageAsRead:", error);
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}

/**
 * Mark all messages as read
 */
export async function markAllMessagesAsRead() {
  try {
    const { supabase } = await requireAuth();

    const { count } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false);

    if (!count || count === 0) {
      return { success: true };
    }

    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("is_read", false);

    if (error) {
      console.error("Error marking all messages as read:", error);
      return { error: error.message };
    }

    await logActivity({
      action: 'update',
      resourceType: 'message',
      resourceName: 'Bulk Update - All Messages',
      details: {
        operation: 'mark_all_as_read',
        messages_updated: count,
      },
    });

    revalidateMessageData();

    return { success: true };

  } catch (error) {
    console.error("❌ Unexpected error in markAllMessagesAsRead:", error);
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}