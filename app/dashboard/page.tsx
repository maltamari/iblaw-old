/// app/dashboard/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Users,
  Briefcase,
  MessageSquare,
  FileText,
  ArrowRight,
  UserPlus,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginButton from "@/components/ui/LoginLogoutButton";

export const metadata: Metadata = {
  title: "Dashboard - IBLAW",
  description:
    "IBLAW internal dashboard for managing content, team members, and administrative data.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get statistics
  const [teamCount, applicationsCount, messagesCount,jobListingsCount] = await Promise.all([
    supabase.from("team_members").select("*", { count: "exact", head: true }),
    supabase
      .from("job_applications")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true }),
      supabase
      .from("job_listings")
      .select("*", { count: "exact", head: true }),
  ]);

  // Get recent applications (last 5)
  const { data: recentApplications } = await supabase
    .from("job_applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  // Get recent messages (last 5)
  const { data: recentMessages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      title: "Team Members",
      value: teamCount.count || 0,
      icon: Users,
      description: "Total team members",
      href: "/dashboard/team",
    },
    {
      title: "Job Applications",
      value: applicationsCount.count || 0,
      icon: Briefcase,
      description: "Total applications received",
      href: "/dashboard/applications",
    },
    {
      title: "Contact Messages",
      value: messagesCount.count || 0,
      icon: MessageSquare,
      description: "Total contact messages",
      href: "/dashboard/messages",
    },
      {
      title: "Opportunities",
      value: jobListingsCount.count || 0,
      icon: FileText,
      description: "Total Job Listings",
      href: "/dashboard/opportunities",
    },
  ] 

  return (
    <div className="container mx-auto p-6 space-y-8 mb-20 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user.user_metadata?.full_name || user.email}
          </p>
        </div>
        <div>
          <LoginButton/>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="group relative overflow-hidden rounded-lg border bg-white p-6 transition-all hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                <div
                  className={`rounded-full p-3 bg-main text-white`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-main group-hover:underline">
                View all
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Applications */}
        <div className="rounded-lg border bg-white">
          <div className="border-b p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Applications</h2>
              <Link
                href="/dashboard/applications"
                className="text-sm text-main hover:underline"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {recentApplications && recentApplications.length > 0 ? (
              recentApplications.map((application) => (
                <div key={application.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {application.first_name} {application.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {application.position}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(application.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      New
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Briefcase className="mx-auto h-12 w-12 opacity-20" />
                <p className="mt-2">No applications yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="rounded-lg border bg-white">
          <div className="border-b p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Messages</h2>
              <Link
                href="/dashboard/messages"
                className="text-sm text-main hover:underline"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {recentMessages && recentMessages.length > 0 ? (
              recentMessages.map((message) => (
                <div key={message.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {message.first_name} {message.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {message.subject}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                      New
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <MessageSquare className="mx-auto h-12 w-12 opacity-20" />
                <p className="mt-2">No messages yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}