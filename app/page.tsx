// app/page.tsx
import ContactSection from "@/components/Global/contactUs";
import AboutSection from "@/components/Home/aboutSection";
import BarSection from "@/components/Home/barSection";
import HeroSection from "@/components/Global/hero";
import MeetingSection from "@/components/Home/contactBar";
import NewsAwardsSection from "@/components/Home/newsAwards";
import PracticesSection from "@/components/Home/practices";
import TeamSection from "@/components/Home/team";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "IBLaw is an international business law firm offering expert legal services across corporate, regulatory, and dispute resolution practices.",
};

export default function Home() {
  return (
<>
    <HeroSection 
    text={"Navigating legal complexities with clarity and precision."} 
    image={"/homeHero.png"}
    textClass="lg:w-220 text-6xl"
    />
    <BarSection/>
    <AboutSection/>
    <PracticesSection/>
    <TeamSection/>
    <NewsAwardsSection/>
    <MeetingSection/>
    <ContactSection/>
</>
  )
}