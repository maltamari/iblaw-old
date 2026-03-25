/// app/dashboard/applications/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ApplicationsTable } from "@/components/dashboard/application/applications-table";
import { Briefcase } from "lucide-react";
import BackButton from "@/components/ui/backButton";

export const metadata: Metadata = {
  title: "Job Applications - Dashboard",
  description: "Manage and review job applications",
  robots: { index: false, follow: false },
};

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: applications } = await supabase
    .from("job_applications")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-6 md:justify-between w-full ">
          {/* Icon and Title Group */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            {/* Icon */}
            <div className="rounded-full bg-blue-100 p-3">
              <Briefcase className="h-6 w-6 text-main" />
            </div>
            
            {/* Title and Description */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">Job Applications</h1>
              <p className="text-muted-foreground">
                Manage and review all job applications ({applications?.length || 0} total)
              </p>
            </div>
          </div>
          
          {/* Actions Group */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Back Button */}
          <BackButton />
          </div>
    </div>
      <ApplicationsTable applications={applications || []} />
    </div>
  );
}






