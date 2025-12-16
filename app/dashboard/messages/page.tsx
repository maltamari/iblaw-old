import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { MessagesTable } from "@/components/dashboard/messages-table";

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get all messages
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <p className="text-muted-foreground">
          View and manage contact form submissions
        </p>
      </div>

      <MessagesTable messages={messages || []} />
    </div>
  );
}