import ContactSection from '@/components/Global/contactUs'
import HeroSection from '@/components/Global/hero'
import MeetingSection from '@/components/Home/contactBar'
import Header from '@/components/Global/header'
import PraciticesAndSectors from '@/components/Practices/praciticesandsectors'

function page() {

  return (
    <>
    <HeroSection image={"/HeroPractices.png"} text={"Practices & Sectors"} className={"h-120"} textClass='w-full' aboutClass="justify-center w-full"/>
    <Header text='The firm thrives on a culture of cooperation and shared contribution, ensuring that expertise
        and experience is shared across departments whenever required for the further benefit of  its clients.
        IBLAW provides solid experience in established areas of practice, with up-to-date knowledge of
        frontier legal developments.'/>
    <PraciticesAndSectors/>
    <MeetingSection/>
    <ContactSection/>
    </>
  )
}

export default page
