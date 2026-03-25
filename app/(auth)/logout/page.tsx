// app/logout/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export default async function LogoutPage() {
  try {
    const supabase = await createClient();
    
    // ✅ Server-side logout
    await supabase.auth.signOut();
    
  } catch (error) {
    console.error("Logout error:", error);
  }
  
  // ✅ Always redirect even if error
  redirect("/login");
}