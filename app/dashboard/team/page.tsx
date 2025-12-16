// ==================== 📁 app/dashboard/team/page.tsx ====================
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { TeamMembersTable } from "@/components/dashboard/team-members-table";
import { AddTeamMemberDialog } from "@/components/dashboard/add-team-member-dialog";
import { Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Team Management - Dashboard",
  description: "Manage team members",
  robots: { index: false, follow: false },
};

export default async function TeamManagementPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get all team members with all fields
  const { data: allMembers } = await supabase
    .from("team_members")
    .select("*")
    .order("name", { ascending: true }); // ترتيب أبجدي

  // تقسيم الأعضاء حسب الفئة
  const partners = allMembers?.filter(m => m.category === 'partner') || [];
  const associates = allMembers?.filter(m => m.category === 'associate') || [];
  const management = allMembers?.filter(m => m.category === 'management') || [];
  const trainees = allMembers?.filter(m => m.category === 'trainee') || [];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-3">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Team Management</h1>
            <p className="text-muted-foreground">
              Manage partners, associates, management, and trainees
            </p>
          </div>
        </div>
        <AddTeamMemberDialog />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Partners</p>
              <p className="text-2xl font-bold text-blue-600">{partners.length}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Associates</p>
              <p className="text-2xl font-bold text-green-600">{associates.length}</p>
            </div>
            <div className="rounded-full bg-green-100 p-2">
              <Users className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Management</p>
              <p className="text-2xl font-bold text-purple-600">{management.length}</p>
            </div>
            <div className="rounded-full bg-purple-100 p-2">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Trainees</p>
              <p className="text-2xl font-bold text-orange-600">{trainees.length}</p>
            </div>
            <div className="rounded-full bg-orange-100 p-2">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      {partners.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-blue-600">
              Partners
            </h2>
          </div>
          <TeamMembersTable members={partners} />
        </div>
      )}

      {/* Associates Section */}
      {associates.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-green-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-green-600">
              Associates
            </h2>
          </div>
          <TeamMembersTable members={associates} />
        </div>
      )}

      {/* Management Section */}
      {management.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-purple-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-purple-600">
              Management
            </h2>
          </div>
          <TeamMembersTable members={management} />
        </div>
      )}

      {/* Trainees Section */}
      {trainees.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-orange-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-orange-600">
              Trainees
            </h2>
          </div>
          <TeamMembersTable members={trainees} />
        </div>
      )}

      {/* Empty State */}
      {!allMembers || allMembers.length === 0 && (
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