// app/(root)/news-awards/page.tsx
import { createClient } from "@/utils/supabase/server";
import HeroSection from "@/components/Global/hero";
import NewsAwardsGrid from "@/components/news-awards/news-awards-grid";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "News & Awards",
  description:
    "Stay updated with the latest news and awards from IBLAW. Discover our achievements and milestones.",
};

export default async function NewsAwardsPage() {
  const supabase = await createClient();

  // Get all published news and awards
  const { data: newsAwards } = await supabase
    .from("news_awards")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false });

  return (
    <>
      <HeroSection
        text="Stay Updated with Our Latest News and Achievements"
        image="/homeHero.png"
        textClass="px-4 lg:w-220 text-6xl"
      />
      
      <Suspense 
        fallback={
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
          </div>
        }
      >
        <NewsAwardsGrid newsAwards={newsAwards || []} />
      </Suspense>

    </>
  );
}