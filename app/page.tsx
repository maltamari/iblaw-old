import ContactSection from "@/components/Global/contactUs";
import AboutSection from "@/components/Home/aboutSection";
import BarSection from "@/components/Home/barSection";
import HeroSection from "@/components/Global/hero";
import MeetingSection from "@/components/Home/contactBar";
import NewsAwardsSection from "@/components/Home/newsAwards";
import PracticesSection from "@/components/Home/practices";
import TeamSection from "@/components/Home/team";


export default function Home() {
  return (
<>
    <HeroSection 
    text={"Navigating legal complexities with clarity and precision."} 
    image={"/homeHero.png"}
    textClass="px-4 lg:w-220 text-6xl"
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