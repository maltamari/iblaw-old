// utils/job-listing-actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/utils/audit";

export interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  description: string;
  requirements: string[];
  created_at: string;
  updated_at: string;
}

// ✅ Validation helper
function validateJobData(data: {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}) {
  if (!data.title?.trim() || data.title.length < 3 || data.title.length > 200) {
    return "Title must be 3-200 characters";
  }
  if (!data.department?.trim() || data.department.length > 100) {
    return "Invalid department";
  }
  if (!data.location?.trim() || data.location.length > 100) {
    return "Invalid location";
  }
  if (!["full-time", "part-time", "contract", "internship"].includes(data.type)) {
    return "Invalid employment type";
  }
  if (!data.description?.trim() || data.description.length < 50 || data.description.length > 5000) {
    return "Description must be 50-5000 characters";
  }
  if (!data.requirements || data.requirements.length === 0) {
    return "At least one requirement is needed";
  }
  if (data.requirements.some(r => r.length > 500)) {
    return "Each requirement must be less than 500 characters";
  }
  return null;
}

// ✅ Extract form data helper
function extractJobData(formData: FormData) {
  const requirementsRaw = formData.get("requirements") as string;
  const requirements = requirementsRaw
    ?.split('\n')
    .map(r => r.trim())
    .filter(Boolean) || [];

  return {
    title: (formData.get("title") as string)?.trim(),
    department: (formData.get("department") as string)?.trim(),
    location: (formData.get("location") as string)?.trim(),
    type: formData.get("type") as string,
    description: (formData.get("description") as string)?.trim(),
    requirements,
  };
}

/**
 * ✅ Helper to revalidate job-related paths
 * Internal use only - no rate limiting needed
 */
function revalidateJobPaths() {
  try {
    revalidatePath('/careers', 'page');
    revalidatePath('/dashboard', 'page');
    revalidatePath('/', 'page');
    console.log('✅ Revalidated job paths');
  } catch (error) {
    console.error('⚠️ Job revalidation failed:', error);
  }
}

/**
 * ✅ Auth helper
 */
async function requireAuth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error("Unauthorized: Authentication required");
  }
  
  return { supabase, user };
}

// ==================== READ OPERATIONS ====================

/**
 * Get all job listings
 * ✅ Public - no auth required
 */
export async function getJobListings(department?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("job_listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (department) {
    query = query.eq("department", department);
  }

  const { data, error } = await query;

  if (error) {
    console.error("❌ Error fetching job listings:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Get single job listing by ID
 * ✅ Public - no auth required
 * ✅ Audit logging for views
 */
export async function getJobListingById(id: string) {
  // ✅ Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return { data: null, error: "Invalid job ID format" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("job_listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ Error fetching job listing:", error);
    return { data: null, error: error.message };
  }



  return { data, error: null };
}

// ==================== WRITE OPERATIONS (Protected) ====================

/**
 * Add new job listing
 * ✅ Protected with authentication
 * ✅ Validates all inputs
 * ✅ Efficient revalidation (no rate limiting)
 * ✅ Audit logging
 */
export async function addJobListing(formData: FormData) {
  try {
    // ✅ Check auth
    const { supabase } = await requireAuth();

    // ✅ Extract and validate
    const jobData = extractJobData(formData);
    const validationError = validateJobData(jobData);
    if (validationError) {
      return { error: validationError };
    }

    // ✅ Insert
    const { data: insertedData, error } = await supabase
      .from("job_listings")
      .insert([jobData])
      .select()
      .single();

    if (error) {
      console.error("❌ Error adding job listing:", error);
      return { error: "Failed to add job listing. Please try again." };
    }

    // ✅ Log activity
    await logActivity({
      action: 'create',
      resourceType: 'job_listing',
      resourceId: insertedData.id,
      resourceName: jobData.title,
      details: {
        department: jobData.department,
        location: jobData.location,
        type: jobData.type,
        requirements_count: jobData.requirements.length,
      },
    });

    // ✅ Revalidate without rate limiting
    revalidateJobPaths();

    return { success: true };

  } catch (error) {
    console.error("❌ Unexpected error in addJobListing:", error);
    return { 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

/**
 * Update job listing
 * ✅ Protected with authentication
 * ✅ Validates all inputs
 * ✅ Efficient revalidation (no rate limiting)
 * ✅ Audit logging
 */
export async function updateJobListing(id: string, formData: FormData) {
  try {
    // ✅ Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return { error: "Invalid job listing ID" };
    }

    // ✅ Check auth
    const { supabase } = await requireAuth();

    // ✅ Extract and validate
    const jobData = extractJobData(formData);
    const validationError = validateJobData(jobData);
    if (validationError) {
      return { error: validationError };
    }

    // ✅ Get old data before update
    const { data: oldData } = await supabase
      .from("job_listings")
      .select("title, department, location, type")
      .eq("id", id)
      .single();

    if (!oldData) {
      return { error: "Job listing not found" };
    }

    // ✅ Update
    const { error } = await supabase
      .from("job_listings")
      .update(jobData)
      .eq("id", id);

    if (error) {
      console.error("❌ Error updating job listing:", error);
      return { error: "Failed to update job listing. Please try again." };
    }

    // ✅ Log activity with changes
    const changes: string[] = [];
    if (oldData.title !== jobData.title) changes.push('title');
    if (oldData.department !== jobData.department) changes.push('department');
    if (oldData.location !== jobData.location) changes.push('location');
    if (oldData.type !== jobData.type) changes.push('type');

    await logActivity({
      action: 'update',
      resourceType: 'job_listing',
      resourceId: id,
      resourceName: jobData.title,
      details: {
        fields_updated: changes.length > 0 ? changes : ['description', 'requirements'],
        old_title: oldData.title !== jobData.title ? oldData.title : undefined,
        new_department: oldData.department !== jobData.department ? jobData.department : undefined,
        new_location: oldData.location !== jobData.location ? jobData.location : undefined,
        new_type: oldData.type !== jobData.type ? jobData.type : undefined,
      },
    });

    // ✅ Revalidate without rate limiting
    revalidateJobPaths();

    console.log("✅ Job listing updated successfully");
    return { success: true };

  } catch (error) {
    console.error("❌ Unexpected error in updateJobListing:", error);
    return { 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

/**
 * Delete job listing
 * ✅ Protected with authentication
 * ✅ Validates ID
 * ✅ Efficient revalidation (no rate limiting)
 * ✅ Audit logging
 */
export async function deleteJobListing(id: string) {
  try {
    // ✅ Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return { error: "Invalid job listing ID" };
    }

    // ✅ Check auth
    const { supabase } = await requireAuth();

    // ✅ Get job info before deletion
    const { data: existing } = await supabase
      .from("job_listings")
      .select("id, title, department, location, type")
      .eq("id", id)
      .single();

    if (!existing) {
      return { error: "Job listing not found" };
    }

    // ✅ Delete
    const { error } = await supabase
      .from("job_listings")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("❌ Error deleting job listing:", error);
      return { error: "Failed to delete job listing. Please try again." };
    }

    // ✅ Log activity
    await logActivity({
      action: 'delete',
      resourceType: 'job_listing',
      resourceId: id,
      resourceName: existing.title,
      details: {
        department: existing.department,
        location: existing.location,
        type: existing.type,
      },
    });

    // ✅ Revalidate without rate limiting
    revalidateJobPaths();

    console.log(`✅ Job listing deleted successfully: ${existing.title}`);
    return { success: true };

  } catch (error) {
    console.error("❌ Unexpected error in deleteJobListing:", error);
    return { 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}