import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { MessagesTable } from "@/components/dashboard/messages-table";
import { MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Messages - Dashboard",
  description: "View and manage contact messages",
  robots: { index: false, follow: false },
};

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-purple-100 p-3">
          <MessageSquare className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Contact Messages</h1>
          <p className="text-muted-foreground">
            View and manage all contact messages ({messages?.length || 0} total)
          </p>
        </div>
      </div>

      <MessagesTable messages={messages || []} />
    </div>
  );
}