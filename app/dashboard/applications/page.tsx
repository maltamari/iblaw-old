import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ApplicationsTable } from "@/components/dashboard/applications-table";
import { Briefcase } from "lucide-react";

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
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-blue-100 p-3">
          <Briefcase className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Job Applications</h1>
          <p className="text-muted-foreground">
            Manage and review all job applications ({applications?.length || 0} total)
          </p>
        </div>
      </div>

      <ApplicationsTable applications={applications || []} />
    </div>
  );
}






