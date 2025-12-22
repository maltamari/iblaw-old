/// utils/job-listing-actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  created_at: string;
  updated_at: string;
}

// Get all job listings
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
    console.error("Error fetching job listings:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Get single job listing by ID
export async function getJobListingById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("job_listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching job listing:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Add new job listing
export async function addJobListing(formData: FormData) {
  const supabase = await createClient();

  // Handle requirements array
  const requirementsRaw = formData.get("requirements") as string;
  const requirements = requirementsRaw 
    ? requirementsRaw.split('\n').filter((r: string) => r.trim())
    : [];
  const data = {
    title: formData.get("title") as string,
    department: formData.get("department") as string,
    location: formData.get("location") as string,
    type: formData.get("type") as string,
    description: formData.get("description") as string,
    requirements,
  };

  // Validate required fields
  if (!data.title || !data.department || !data.location || !data.type || !data.description || requirements.length === 0) {
    return { error: "Please fill all required fields" };
  }

  const { error } = await supabase.from("job_listings").insert([data]);

  if (error) {
    console.error("Error adding job listing:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/careers");
  revalidatePath("/careers");
  return { success: true };
}

// Update job listing
export async function updateJobListing(id: string, formData: FormData) {
  const supabase = await createClient();

  // Handle requirements array
  const requirementsRaw = formData.get("requirements") as string;
  const requirements = requirementsRaw 
    ? requirementsRaw.split('\n').filter((r: string) => r.trim())
    : [];

  const data = {
    title: formData.get("title") as string,
    department: formData.get("department") as string,
    location: formData.get("location") as string,
    type: formData.get("type") as string,
    description: formData.get("description") as string,
    requirements,
  };

  // Validate required fields
  if (!data.title || !data.department || !data.location || !data.type || !data.description || requirements.length === 0) {
    return { error: "Please fill all required fields" };
  }

  const { error } = await supabase
    .from("job_listings")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error("Error updating job listing:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/careers");
  revalidatePath("/careers");
  
  return { success: true };
}

// Delete job listing
export async function deleteJobListing(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("job_listings")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting job listing:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/careers");
  revalidatePath("/careers");
  return { success: true };
}