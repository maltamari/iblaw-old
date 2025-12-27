/// utils/team-actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type TeamCategory = 'partner' | 'associate' | 'management' | 'trainee';

export interface TeamMember {
  id: string;
  name: string;
  slug: string;
  role: string;
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

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') 
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-') 
    .replace(/^-+|-+$/g, ''); 
}

// Get all team members
export async function getTeamMembers(category?: string) {
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

  return { data, error: null };
}

// Get single team member by slug
export async function getTeamMemberBySlug(slug: string) {
  const supabase = await createClient();

  console.log("🔍 Looking for slug:", slug);

  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("❌ Error fetching team member:", error);
    console.error("Requested slug:", slug);
    
    // Try to find all slugs for debugging
    const { data: allMembers } = await supabase
      .from("team_members")
      .select("name, slug");
    console.log("📋 Available members:", allMembers);
    
    return { data: null, error: error.message };
  }

  console.log("✅ Found member:", data?.name);
  return { data: data as TeamMember, error: null };
}

export async function addTeamMember(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const customSlug = formData.get("slug") as string;
  const slug = customSlug?.trim() || generateSlug(name);

  const data = {
    name,
    slug,
    role: formData.get("role") as string,
    department: formData.get("department") as string || null,
    category: formData.get("category") as string,
    email: formData.get("email") as string || null,
    phone: formData.get("phone") as string || null,
    oath_year: parseInt(formData.get("oath_year") as string) || 0,
    biography: formData.get("biography") as string || null,
    photo_url: formData.get("photo_url") as string || null,      // ✅ موجود
    vcard_url: formData.get("vcard_url") as string || null,      // ✅ جديد
    bio_pdf_url: formData.get("bio_pdf_url") as string || null,  // ✅ جديد
  };

  if (!data.name || !data.role || !data.department || !data.category) {
    return { error: "Please fill all required fields" };
  }

  const { error } = await supabase.from("team_members").insert([data]);

  if (error) {
    console.error("Error adding team member:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/team");
  revalidatePath("/team");
  return { success: true };
}

// Update team member
export async function updateTeamMember(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const customSlug = formData.get("slug") as string;
  const slug = customSlug?.trim() || generateSlug(name);

  const data: any = {
    name,
    slug,
    role: formData.get("role") as string,
    department: formData.get("department") as string || null,
    category: formData.get("category") as string,
    email: formData.get("email") as string || null,
    phone: formData.get("phone") as string || null,
    oath_year: parseInt(formData.get("oath_year") as string) || 0,
    biography: formData.get("biography") as string || null,
    photo_url: formData.get("photo_url") as string || null,      // ✅ موجود
    vcard_url: formData.get("vcard_url") as string || null,      // ✅ جديد
    bio_pdf_url: formData.get("bio_pdf_url") as string || null,  // ✅ جديد
  };

  // Handle arrays - education
  const education = formData.get("education") as string;
  if (education) {
    data.education = education.split('\n').filter((e: string) => e.trim());
  } else {
    data.education = [];
  }

  // Handle arrays - practice_areas
  const practice_areas = formData.get("practice_areas") as string;
  if (practice_areas) {
    data.practice_areas = practice_areas.split('\n').filter((p: string) => p.trim());
  } else {
    data.practice_areas = [];
  }

  if (!data.name || !data.role || !data.category) {
    return { error: "Please fill all required fields" };
  }

  const { error } = await supabase
    .from("team_members")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error("Error updating team member:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/team");
  revalidatePath("/team");
  revalidatePath(`/team/${slug}`);
  
  return { success: true };
}
// Delete team member
export async function deleteTeamMember(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("team_members").delete().eq("id", id);

  if (error) {
    console.error("Error deleting team member:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/team");
  revalidatePath("/team");
  return { success: true };
}