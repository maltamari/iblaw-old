import AboutLeading from '@/components/About/leading'
import ContactSection from '@/components/Global/contactUs'
import HeroSection from '@/components/Global/hero'
import MeetingSection from '@/components/Home/contactBar'
import PracticesSectorsSection from '@/components/Home/practices'

function page() {
  return (
    <>
    <HeroSection image={"/abouthero.png"} text={"About IBLaw"} className={"object-center h-120"} textClass='  w-full' aboutClass="justify-center"/>
    <AboutLeading/>
    <PracticesSectorsSection/>
    <MeetingSection/>
    <ContactSection/>
    </>
  )
}

export default page