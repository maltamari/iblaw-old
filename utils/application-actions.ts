"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Delete application
export async function deleteApplication(id: string) {
  try {
    const supabase = await createClient();

    // Get the application to find CV path
    const { data: application, error: fetchError } = await supabase
      .from("job_applications")
      .select("cv_url")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching application:", fetchError);
      return { error: fetchError.message };
    }

    // Delete from database first
    const { error: deleteError } = await supabase
      .from("job_applications")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting application:", deleteError);
      return { error: deleteError.message };
    }

    // Delete CV file from storage if exists
    if (application?.cv_url) {
      const { error: storageError } = await supabase.storage
        .from("cvs")
        .remove([application.cv_url]);

      if (storageError) {
        console.error("Error deleting CV file:", storageError);
        // Don't return error here, database deletion succeeded
      }
    }

    // Revalidate paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/applications");
    
    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}

// Get signed URL for CV download
export async function getSignedCVUrl(cvPath: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.storage
      .from("cvs")
      .createSignedUrl(cvPath, 60); // Valid for 60 seconds

    if (error) {
      console.error("Error creating signed URL:", error);
      return { data: null, error: error.message };
    }

    return { data: data.signedUrl, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { data: null, error: "An unexpected error occurred" };
  }
}

// Delete message
export async function deleteMessage(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting message:", error);
      return { error: error.message };
    }

    // Revalidate paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/messages");
    
    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}

// Mark message as read
export async function markMessageAsRead(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      console.error("Error marking message as read:", error);
      return { error: error.message };
    }

    // Revalidate paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/messages");
    
    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}