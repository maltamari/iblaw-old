import HeroSection from '@/components/Global/hero'
import MeetingSection from '@/components/Home/contactBar';
import ContactSection from '@/components/Global/contactUs';
import { practicesAndSectorsBase } from '@/lib/practicesAndSectorsPagesData';
import PracticesDetails from '@/components/Practices/practicesPages';



export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log(slug)
  const sector = practicesAndSectorsBase.find(s => s.slug === slug);

  const title = sector?.title ?? slug;
  return (
    <>
              <PracticesDetails slug={slug}/>
              <MeetingSection/>
              <ContactSection/>

    </>
  );
}
