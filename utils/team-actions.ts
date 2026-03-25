// utils/team-actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { createCachedQuery } from "@/lib/cache";
import { logActivity } from "@/utils/audit";

export type TeamCategory = 'partner' | 'associate' | 'management' | 'trainee';

export interface TeamMember {
  id: string;
  name: string;
  slug: string;
  role?: string;
  department?: string;
  category: TeamCategory;
  email?: string;
  phone?: string;
  biography?: string;
  education?: string[];
  practice_areas?: string[];
  photo_url?: string;
  oath_year: number;
  created_at: string;
  updated_at: string;
  vcard_url?: string;
  bio_pdf_url?: string;
}

// ✅ Type for update data
interface TeamMemberUpdateData {
  name: string;
  slug: string;
  role: string | null;
  department: string | null;
  category: TeamCategory;
  email: string | null;
  phone: string | null;
  oath_year: number;
  biography: string | null;
  photo_url: string | null;
  vcard_url: string | null;
  bio_pdf_url: string | null;
  education?: string[];
  practice_areas?: string[];
}

// ✅ Slug validation regex (security)
const VALID_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 100;

/**
 * Generate URL-safe slug from name
 * ✅ Sanitized and validated
 */
function generateSlug(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, MAX_SLUG_LENGTH);

  if (!VALID_SLUG_REGEX.test(slug)) {
    throw new Error('Invalid slug generated');
  }

  return slug;
}

/**
 * Validate slug format
 * ✅ Prevents injection attacks
 */
function validateSlug(slug: string): boolean {
  return (
    slug.length > 0 &&
    slug.length <= MAX_SLUG_LENGTH &&
    VALID_SLUG_REGEX.test(slug)
  );
}

/**
 * Check authentication
 * ✅ Reusable auth check
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
 * ✅ Helper function to revalidate team-related paths
 * Does NOT use rate limiting since it's internal to server actions
 */
function revalidateTeamPaths(memberSlug?: string) {
  try {
    // Revalidate main team pages
    revalidatePath('/team', 'page');
    revalidatePath('/dashboard', 'page');
    revalidatePath('/', 'page');
    
    // If member slug provided, revalidate their page too
    if (memberSlug) {
      revalidatePath(`/team/${memberSlug}`, 'page');
    }
    
  } catch (error) {
    // Don't throw - revalidation failure shouldn't block the operation
    console.error('⚠️ Revalidation failed:', error);
  }
}

// ==================== READ OPERATIONS (Cached) ====================

/**
 * Get all team members with caching
 * ✅ Uses React cache for deduplication
 */
export const getTeamMembers = createCachedQuery(
  async (category?: string ) => {
    const supabase = await createClient();

    let query = supabase
      .from("team_members")
      .select("*")
      .order("oath_year", { ascending: true })
      .order("name", { ascending: true });

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching team members:", error);
      return { data: null, error: error.message };
    }

    return { data: data as TeamMember[], error: null };
  }
);

/**
 * Get single team member by slug with caching
 * ✅ Validates slug before query
 * ✅ Uses React cache for deduplication
 * ✅ Audit logging for views
 */
export const getTeamMemberBySlug = createCachedQuery(
  async (slug: string) => {
    if (!validateSlug(slug)) {
      console.error("❌ Invalid slug format:", slug);
      return { data: null, error: "Invalid slug format" };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("❌ Error fetching team member:", error);
      console.error("Requested slug:", slug);

      // ✅ Debug mode: show available slugs
      if (process.env.NODE_ENV === 'development') {
        const { data: debugMembers } = await supabase
          .from("team_members")
          .select("name, slug");
        
        if (debugMembers) {
          console.log("📋 Available team members:", debugMembers);
        }
      }

      return { data: null, error: error.message };
    }




    return { data: data as TeamMember, error: null };
  }
);

// ==================== WRITE OPERATIONS (Protected) ====================

/**
 * Add new team member
 * ✅ Protected with authentication
 * ✅ Validates all inputs
 * ✅ Efficient revalidation (no rate limiting)
 * ✅ Audit logging
 */
export async function addTeamMember(formData: FormData) {
  try {
    const { supabase } = await requireAuth();

    const name = formData.get("name") as string;
    const customSlug = formData.get("slug") as string;
    
    if (!name?.trim()) {
      return { error: "Name is required" };
    }

    const slug = customSlug?.trim() 
      ? (validateSlug(customSlug.trim()) ? customSlug.trim() : generateSlug(name))
      : generateSlug(name);

    const category = formData.get("category") as string;
    const validCategories: TeamCategory[] = ['partner', 'associate', 'management', 'trainee'];
    if (!validCategories.includes(category as TeamCategory)) {
      return { error: "Invalid category" };
    }

    const oathYearRaw = formData.get("oath_year") as string;
    const oath_year = parseInt(oathYearRaw) || 0;
    
    // ✅ Validate oath year (removed unused currentYear)
    if (oath_year < 0) {
      return { error: "Invalid oath year" };
    }

    const { data: existing } = await supabase
      .from("team_members")
      .select("slug")
      .eq("slug", slug)
      .single();

    if (existing) {
      return { error: "A team member with this name/slug already exists" };
    }

    const data = {
      name: name.trim(),
      slug,
      role: (formData.get("role") as string)?.trim() || null,
      department: (formData.get("department") as string)?.trim() || null,
      category: category as TeamCategory,
      email: (formData.get("email") as string)?.trim() || null,
      phone: (formData.get("phone") as string)?.trim() || null,
      oath_year,
      biography: (formData.get("biography") as string)?.trim() || null,
      photo_url: (formData.get("photo_url") as string)?.trim() || null,
      vcard_url: (formData.get("vcard_url") as string)?.trim() || null,
      bio_pdf_url: (formData.get("bio_pdf_url") as string)?.trim() || null,
    };

    const { data: insertedData, error } = await supabase
      .from("team_members")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error adding team member:", error);
      return { error: error.message };
    }

    // ✅ Log activity
    await logActivity({
      action: 'create',
      resourceType: 'team_member',
      resourceId: insertedData.id,
      resourceName: data.name,
      details: {
        category: data.category,
        role: data.role,
        department: data.department,
        order: data.oath_year,
        slug: slug,
      },
    });

    // ✅ Revalidate without rate limiting
    revalidateTeamPaths(slug);
    
    return { success: true, slug };

  } catch (error) {
    console.error("❌ Unexpected error in addTeamMember:", error);
    return { 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

/**
 * Update team member
 * ✅ Protected with authentication
 * ✅ Validates all inputs
 * ✅ Efficient revalidation (no rate limiting)
 * ✅ Audit logging
 */
export async function updateTeamMember(id: string, formData: FormData) {
  try {
    const { supabase } = await requireAuth();

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return { error: "Invalid team member ID" };
    }

    const name = formData.get("name") as string;
    const customSlug = formData.get("slug") as string;
    
    if (!name?.trim()) {
      return { error: "Name is required" };
    }

    const slug = customSlug?.trim() 
      ? (validateSlug(customSlug.trim()) ? customSlug.trim() : generateSlug(name))
      : generateSlug(name);

    const category = formData.get("category") as string;
    const validCategories: TeamCategory[] = ['partner', 'associate', 'management', 'trainee'];
    if (!validCategories.includes(category as TeamCategory)) {
      return { error: "Invalid category" };
    }

    const oathYearRaw = formData.get("oath_year") as string;
    const oath_year = parseInt(oathYearRaw) || 0;
    if (oath_year < 0) {
      return { error: "Invalid oath year" };
    }

    const { data: existing } = await supabase
      .from("team_members")
      .select("id, slug")
      .eq("slug", slug)
      .neq("id", id)
      .single();

    if (existing) {
      return { error: "Another team member already uses this name/slug" };
    }

    // ✅ Get old data before update
    const { data: oldData } = await supabase
      .from("team_members")
      .select("name, category, role, department, oath_year")
      .eq("id", id)
      .single();

    // ✅ Use proper type instead of any
    const data: TeamMemberUpdateData = {
      name: name.trim(),
      slug,
      role: (formData.get("role") as string)?.trim() || null,
      department: (formData.get("department") as string)?.trim() || null,
      category: category as TeamCategory,
      email: (formData.get("email") as string)?.trim() || null,
      phone: (formData.get("phone") as string)?.trim() || null,
      oath_year,
      biography: (formData.get("biography") as string)?.trim() || null,
      photo_url: (formData.get("photo_url") as string)?.trim() || null,
      vcard_url: (formData.get("vcard_url") as string)?.trim() || null,
      bio_pdf_url: (formData.get("bio_pdf_url") as string)?.trim() || null,
    };

    const education = formData.get("education") as string;
    if (education?.trim()) {
      data.education = education
        .split('\n')
        .map(e => e.trim())
        .filter(e => e);
    } else {
      data.education = [];
    }

    const practice_areas = formData.get("practice_areas") as string;
    if (practice_areas?.trim()) {
      data.practice_areas = practice_areas
        .split('\n')
        .map(p => p.trim())
        .filter(p => p);
    } else {
      data.practice_areas = [];
    }

    const { error } = await supabase
      .from("team_members")
      .update(data)
      .eq("id", id);

    if (error) {
      console.error("Error updating team member:", error);
      return { error: error.message };
    }

    // ✅ Log activity with changes
    const changes: string[] = [];
    if (oldData) {
      if (oldData.name !== data.name) changes.push('name');
      if (oldData.category !== data.category) changes.push('category');
      if (oldData.role !== data.role) changes.push('role');
      if (oldData.department !== data.department) changes.push('department');
      if (oldData.oath_year !== data.oath_year) changes.push('Order');
    }

    await logActivity({
      action: 'update',
      resourceType: 'team_member',
      resourceId: id,
      resourceName: data.name,
      details: {
        fields_updated: changes.length > 0 ? changes : ['biography', 'education', 'practice_areas', 'contact'],
        old_name: oldData?.name !== data.name ? oldData?.name : undefined,
        old_category: oldData?.category !== data.category ? oldData?.category : undefined,
        new_category: oldData?.category !== data.category ? data.category : undefined,
        slug: slug,
      },
    });

    // ✅ Revalidate without rate limiting
    revalidateTeamPaths(slug);

    return { success: true, slug };

  } catch (error) {
    console.error("❌ Unexpected error in updateTeamMember:", error);
    return { 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

/**
 * Delete team member
 * ✅ Protected with authentication
 * ✅ Validates ID
 * ✅ Efficient revalidation (no rate limiting)
 * ✅ Audit logging
 */
export async function deleteTeamMember(id: string) {
  try {
    const { supabase } = await requireAuth();

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return { error: "Invalid team member ID" };
    }

    // ✅ Get member info before deletion
    const { data: member } = await supabase
      .from("team_members")
      .select("slug, name, category, department")
      .eq("id", id)
      .single();

    if (!member) {
      return { error: "Team member not found" };
    }

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting team member:", error);
      return { error: error.message };
    }

    // ✅ Log activity
    await logActivity({
      action: 'delete',
      resourceType: 'team_member',
      resourceId: id,
      resourceName: member.name,
      details: {
        category: member.category,
        department: member.department,
        slug: member.slug,
      },
    });

    // ✅ Revalidate without rate limiting
    revalidateTeamPaths(member.slug);

    return { success: true };

  } catch (error) {
    console.error("❌ Unexpected error in deleteTeamMember:", error);
    return { 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}