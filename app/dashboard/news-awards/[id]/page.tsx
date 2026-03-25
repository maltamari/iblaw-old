import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NewsAwardForm } from "@/components/dashboard/news-awards/news-award-form";
import { Newspaper } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewsAwardFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const isNew = resolvedParams.id === "new";
  let newsAward = null;

  if (!isNew) {
    const { data } = await supabase
      .from("news_awards")
      .select("*")
      .eq("id", resolvedParams.id)
      .single();

    newsAward = data;

    // If not found, redirect to list
    if (!newsAward) {
      redirect("/dashboard/news-awards");
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6 mt-10 max-w-4xl">
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
            <h1 className="text-3xl font-bold mb-2">
              {isNew ? "Add New" : "Edit"} News/Award
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Create a new" : "Update"} news article or award
            </p>
          </div>
        </div>

        {/* Actions Group */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Back Button */}
          <Link href="/dashboard/news-awards">
            <Button className="flex items-center gap-2 bg-[#195889] hover:bg-[#4c7da3] px-6 py-3 rounded-full transition-all duration-300 hover:-translate-x-1">
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="font-medium">Back to List</span>
            </Button>
          </Link>
        </div>
      </div>

      <NewsAwardForm newsAward={newsAward} isNew={isNew} />
    </div>
  );
}