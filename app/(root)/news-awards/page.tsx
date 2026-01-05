import { createClient } from "@/utils/supabase/server";
import HeroSection from "@/components/Global/hero";
import NewsAwardsGrid from "@/components/news-awards/news-awards-grid";
import type { Metadata } from "next";
import ContactSection from "@/components/Global/contactUs";
import MeetingSection from "@/components/Home/contactBar";

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
      
      <NewsAwardsGrid newsAwards={newsAwards || []} />
      <MeetingSection/>
      <ContactSection/>
      
    </>
  );
}