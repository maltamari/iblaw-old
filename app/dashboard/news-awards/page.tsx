import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NewsAwardsTable } from "@/components/dashboard/news-awards/news-awards-table";
import { Newspaper } from "lucide-react";

import BackButton from "@/components/ui/backButton";

export default async function NewsAwardsDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get all news and awards
  const { data: newsAwards } = await supabase
    .from("news_awards")
    .select("*")
    .order("date", { ascending: false });

  return (
    <div className="container mx-auto p-6 space-y-6 mt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:justify-between w-full">
        {/* Icon and Title Group */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          {/* Icon */}
          <div className="rounded-full bg-blue-100 p-3">
            <Newspaper className="h-6 w-6 text-main" />
          </div>

          {/* Title and Description */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">News & Awards</h1>
            <p className="text-muted-foreground">
              Manage your news articles and awards
            </p>
          </div>
        </div>

        {/* Actions Group */}
        <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Add New Button */}
            <BackButton/>
        </div>
      </div>

      <NewsAwardsTable newsAwards={newsAwards || []} />
    </div>
  );
}