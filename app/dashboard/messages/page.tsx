/// app/dashboard/messages/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { MessagesTable } from "@/components/dashboard/messages/messages-table";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <div className="container mx-auto p-6 space-y-6 mt-10 ">
            {/* Header */}
    <div className="flex flex-col md:flex-row items-center gap-6 md:justify-between w-full ">
          {/* Icon and Title Group */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            {/* Icon */}
            <div className="rounded-full bg-blue-100 p-3">
              <MessageSquare className="h-6 w-6 text-main" />
            </div>
            
            {/* Title and Description */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">Contact Messages</h1>
              <p className="text-muted-foreground">
                View and manage contact form submissions
              </p>
            </div>
          </div>
          
          {/* Actions Group */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Back Button */}
            <Link href="/dashboard" className="">
              <Button className="flex items-center gap-2 bg-[#195889] hover:bg-[#4c7da3] px-6 py-3 rounded-full transition-all duration-300 hover:-translate-x-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Dashboard</span>
              </Button> 
            </Link>
          </div>
    </div>
      <MessagesTable messages={messages || []} />
    </div>
  );
}