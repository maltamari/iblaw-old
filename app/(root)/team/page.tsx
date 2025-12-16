import ContactSection from '@/components/Global/contactUs'
import Header from '@/components/Global/header'
import HeroSection from '@/components/Global/hero'
import MeetingSection from '@/components/Home/contactBar'
import Employees from '@/components/Team/employees'
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the experienced lawyers and legal professionals at IBLaw who are dedicated to serving our clients.",
};
function page() {
  return (
    <>
    <HeroSection image={"/HeroTeam.png"} text={"Our Team"} className={"h-100 w-full"} textClass='w-full' aboutClass="justify-center w-full"/>
    <Header text="At IBLAW, our distinction comes from the caliber and structure of our team. The firm is organized by practice areas and divided into departments, each led by a partner and supported by fully dedicated teams of specialized attorneys. Our team culture and practice management style ensure resource and experience sharing across departments whenever needed, for the benefit of our clients. This structure enables us to provide holistic legal advice and guidance by leveraging insights from multiple relevant departments, thereby ensuring our clients' best interests are thoroughly and consistently addressed."/>
   <Employees/>
   <MeetingSection/>
   <ContactSection/>
    </>
  )
}

export default page