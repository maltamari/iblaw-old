import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { EmailSettingsClient } from "@/components/dashboard/email-settings/email-settings-client";
import { Settings } from "lucide-react";
import BackButton from "@/components/ui/backButton";

export default async function EmailSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get email mappings
  const { data: mappings } = await supabase
    .from("subject_email_mappings")
    .select("*")
    .order("subject_label");

  return (
    <div className="container mx-auto p-6 space-y-6 mt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:justify-between w-full">
        {/* Icon and Title Group */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          {/* Icon */}
          <div className="rounded-full bg-blue-100 p-3">
            <Settings className="h-6 w-6 text-main" />
          </div>
          
          {/* Title and Description */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">Email Settings</h1>
            <p className="text-muted-foreground">
              Configure which email receives messages for each category
            </p>
          </div>
        </div>
        
        {/* Actions Group */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Back Button */}
        <BackButton text="messages"/>
        </div>
      </div>

      {/* Email Settings Content */}
      <EmailSettingsClient initialMappings={mappings || []} />
    </div>
  );
}