import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { MessagesTableWithFilter } from "@/components/dashboard/messages/messages-table-with-filter";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/backButton";
import type { Message, DatabaseMessage } from "@/lib/message";

export default async function MessagesPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get all messages from database
  const { data: dbMessages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<DatabaseMessage[]>();

  // Transform database messages to match component's expected type
  const messages: Message[] = (dbMessages || []).map((msg) => {
    // Split name into first_name and last_name
    const nameParts = msg.name.trim().split(' ');
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ') || '';

    return {
      id: msg.id,
      first_name,
      last_name,
      email: msg.email,
      subject: msg.subject,
      subject_key: msg.subject_key,
      message: msg.message,
      is_read: msg.is_read,
      created_at: msg.created_at,
    };
  });

  // Get subject statistics
  const messagesBySubject = messages.reduce(
    (acc: Record<string, number>, msg) => {
      const key = msg.subject_key || 'other';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className="container mx-auto p-6 space-y-6 mt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:justify-between w-full">
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
              View and manage contact form submissions ({messages.length || 0} total)
            </p>
          </div>
        </div>

        {/* Actions Group */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Email Settings Button */}
          <Button variant="outline" asChild>
            <Link 
              href="/dashboard/email-settings"
              className="flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 hover:-translate-y-1"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
              <span className="font-medium">Email Settings</span>
            </Link>
          </Button>

          {/* Back Button */}
          <BackButton />
        </div>
      </div>

      {/* Messages Table with Filtering */}
      <MessagesTableWithFilter 
        messages={messages} 
        subjectStats={messagesBySubject}
      />
    </div>
  );
}