import MeetingSection from '@/components/Home/contactBar';
import ContactSection from '@/components/Global/contactUs';
import { practicesAndSectorsBase } from '@/lib/practicesAndSectorsPagesData';
import PracticesDetails from '@/components/Practices/practicesPages';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practices & Sectors",
  description:
    "Explore IBLaw’s legal practices and sectors, including corporate governance, compliance, finance, dispute resolution, and more.",
};

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
