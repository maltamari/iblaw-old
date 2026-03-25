// app/dashboard/careers/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { JobListingsTable } from "@/components/dashboard/job-listing/job-listings-table";
import { AddJobListingDialog } from "@/components/dashboard/job-listing/job-listing-dialogs";
import { Briefcase } from "lucide-react";
import BackButton from "@/components/ui/backButton";
import { createCachedQuery } from "@/lib/cache";

export const metadata: Metadata = {
  title: "Careers Management - Dashboard",
  description: "Manage job listings",
  robots: { index: false, follow: false },
};

// ✅ Job types configuration
const jobTypes = [
  { key: 'Full-time', label: 'Full-time' },
  { key: 'part-time', label: 'Part-time' },
  { key: 'contract', label: 'Contract' },
  { key: 'internship', label: 'Internship' },
] as const;

// ✅ Cached query for job listings
const getJobListings = createCachedQuery(async () => {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("job_listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error fetching job listings:", error);
    return null;
  }

  return data;
});

export default async function CareersManagementPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // ✅ Fetch jobs with caching
  const allJobs = await getJobListings();

  // ✅ Group jobs by type (نفس اللوجيك القديم)
  const groupedJobs = jobTypes.map(type => ({
    ...type,
    jobs: allJobs?.filter(j => j.type === type.key) || []
  }));

  // Calculate total jobs
  const totalJobs = allJobs?.length || 0;

  return (
    <div className="container mx-auto p-6 space-y-8 mt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:justify-between w-full">
        {/* Icon and Title Group */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          {/* Icon */}
          <div className="rounded-full bg-blue-100 p-3">
            <Briefcase className="h-6 w-6 text-main" />
          </div>
          
          {/* Title and Description */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">Careers Management</h1>
            <p className="text-muted-foreground">
              Manage job openings and career opportunities ({totalJobs} total)
            </p>
          </div>
        </div>
        
        {/* Actions Group */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Back Button */}
          <BackButton/>
          
          {/* Add Job Listing Dialog */}
          <AddJobListingDialog /> 
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {groupedJobs.map(({ label, jobs }) => (
          <div key={label} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold text-main">{jobs.length}</p>
              </div>
              <div className="rounded-full p-2 bg-blue-100">
                <Briefcase className="h-5 w-5 text-main" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* All Jobs Section */}
      {totalJobs > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-main rounded-full"></div>
            <h2 className="text-2xl font-bold text-main">All Job Listings</h2>
          </div>
          <JobListingsTable jobs={allJobs || []} />
        </div>
      )}

      {/* Job Sections by Type */}
      {groupedJobs.map(({ label, jobs }) => 
        jobs.length > 0 && (
          <div key={label} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-main rounded-full"></div>
              <h2 className="text-2xl font-bold text-main">{label} Positions</h2>
            </div>
            <JobListingsTable jobs={jobs} />
          </div>
        )
      )}

      {/* Empty State */}
      {totalJobs === 0 && (
        <div className="rounded-lg border bg-white p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No job listings yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started by adding your first job opening
          </p>
          <div className="mt-6">
            <AddJobListingDialog />
          </div>
        </div>
      )}
    </div>
  );
}