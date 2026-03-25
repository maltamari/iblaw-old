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
  return (
    <>
        <PracticesDetails slug={slug}/>

    </>
  );
}
