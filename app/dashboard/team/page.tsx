// ==================== 📁 app/dashboard/team/page.tsx ====================
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { TeamMembersTable } from "@/components/dashboard/team/team-members-table";
import { AddTeamMemberDialog } from "@/components/dashboard/team/add-team-member-dialog";
import { Users } from "lucide-react";
import BackButton from "@/components/ui/backButton";

export const metadata: Metadata = {
  title: "Team Management - Dashboard",
  description: "Manage team members",
  robots: { index: false, follow: false },
};

const categories = [
  { key: 'partner', label: 'Partners'},
  { key: 'associate', label: 'Associates' },
  { key: 'management', label: 'Management' },
  { key: 'trainee', label: 'Trainees' },
] as const;

export default async function TeamManagementPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: allMembers } = await supabase
    .from("team_members")
    .select("*")
    .order("name", { ascending: true }); 

  const groupedMembers = categories.map(cat => ({
    ...cat,
    members: allMembers?.filter(m => m.category === cat.key) || []
  }));

  return (
    <div className="container mx-auto p-6 space-y-8 mt-10">
      {/* Header */}
    <div className="flex flex-col md:flex-row items-center gap-6 md:justify-between w-full">
          {/* Icon and Title Group */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            {/* Icon */}
            <div className="rounded-full bg-blue-100 p-3">
              <Users className="h-6 w-6 text-main" />
            </div>
            
            {/* Title and Description */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">Team Management</h1>
              <p className="text-muted-foreground">
                Manage partners, associates, management, and trainees
              </p>
            </div>
          </div>
          
          {/* Actions Group */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Back Button */}
            <BackButton/>
            
            {/* Add Member Dialog */}
            <AddTeamMemberDialog /> 
          </div>
        </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {groupedMembers.map(({ label, members }) => (
          <div key={label} className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold text-main">{members.length}</p>
              </div>
              <div className={`rounded-full bg-blue-100 p-2`}>
                <Users className={`h-5 w-5 text-main`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Team Sections */}
      {groupedMembers.map(({ label, members }) => 
        members.length > 0 && (
          <div key={label} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-main rounded-full"></div>
              <h2 className="text-2xl font-bold text-main">{label}</h2>
            </div>
            <TeamMembersTable members={members} />
          </div>
        )
      )}

      {/* Empty State */}
      {(!allMembers?.length) && (
        <div className="rounded-lg border bg-white p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No team members yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started by adding your first team member
          </p>
          <div className="mt-6">
            <AddTeamMemberDialog />
          </div>
        </div>
      )}
    </div>
  );
}
