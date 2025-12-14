import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.user_metadata?.full_name || user.email}
          </p>
        </div>

        {/* Dashboard content here */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h3 className="font-semibold">Total Users</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="font-semibold">Active Sessions</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="font-semibold">Revenue</h3>
            <p className="text-3xl font-bold mt-2">$0</p>
          </div>
        </div>
      </div>
    </div>
  );
}