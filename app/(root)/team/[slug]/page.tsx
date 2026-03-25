import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, Phone, FileText, LucideFileUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTeamMemberBySlug } from "@/utils/team-actions";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

function getGoogleDriveImageUrl(url: string) {
  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }
  return url;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: member } = await getTeamMemberBySlug(slug);

  if (!member) {
    return {
      title: "Member Not Found",
    };
  }

  return {
    title: `${member.name} - ${member.role} | IBLAW`,
    description: member.biography || `${member.name} - ${member.role} at IBLAW`,
  };
}

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const categoryLabels = {
  partner: "PARTNERS",
  associate: "ASSOCIATES",
  management: "MANAGEMENT",
  trainee: "TRAINEES",
};

export default async function TeamMemberPage({ params }: Props) {
  const { slug } = await params;
  const { data: member, error } = await getTeamMemberBySlug(slug);

  if (error || !member) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 w-full">
      {/* Header with Back Button */}
      <div className="bg-white border-b  ">
        <div className=" py-6 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <Link href="/team" className="inline-flex items-center text-main hover:bg-main/5 p-2 rounded-md transition-all">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Team
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8  py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 ">
            {/* Avatar */}
            <div className=" relative w-32 h-32 md:w-48 md:h-48 rounded-full bg-main flex items-center justify-center shadow-xl shrink-0 overflow-hidden">
              {member.photo_url ? (
                <Image
                  src={getGoogleDriveImageUrl(member.photo_url)}
                  alt={member.name}
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                  unoptimized 
                />
              ) : (
                <div className="text-white font-bold text-5xl md:text-7xl">
                  {getInitials(member.name)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {member.name}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-4">{member.role}</p>

              <Link href={`/team#associate`} className="inline-block mb-4">
                <span className="text-sm font-semibold text-white bg-main px-4 py-2 rounded-full shadow-md">
                  {categoryLabels[member.category as keyof typeof categoryLabels] || "TEAM MEMBER"}
                </span>
              </Link>

              {/* Contact Info */}
              {(member.email || member.phone) && (
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  {member.email && (
                    <Link href={`mailto:${member.email}`}>
                      <Button className="text-main font-bold">
                        <Mail className="h-6 w-6" />
                        {member.email}
                      </Button>
                    </Link>
                  )}
                  {member.phone && (
                    <Link href={`tel:${member.phone}`}>
                      <Button variant="outline">
                        <Phone className="mr-2 h-4 w-4" />
                        {member.phone}
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              {/* ✅ Download Buttons - Via API Route */}
              {(member.vcard_url || member.bio_pdf_url) && (
                <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  {member.vcard_url && (
                    <Link 
                      href={`/api/download?url=${encodeURIComponent(member.vcard_url)}&type=vcard&filename=${encodeURIComponent(member.name.replace(/\s+/g, '-'))}.vcf`}
                      className="inline-block"
                    >
                      <Button className="bg-main rounded-full text-white font-bold w-full sm:w-auto transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-400/20">
                      <LucideFileUser className="h-4 w-4 " />
                        Download VCard
                      </Button>
                    </Link>
                  )}
                  {member.bio_pdf_url && (
                    <Link
                        href={`/api/download?url=${encodeURIComponent(member.bio_pdf_url)}&type=pdf&filename=${encodeURIComponent(member.name.replace(/\s+/g, '-'))}-Biography.pdf&inline=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <Button className="bg-main rounded-full text-white font-bold">
                          <FileText className="h-4 w-4" />
                          View Bio PDF
                        </Button>
                      </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">
        {/* Practice Areas */}
        {member.practice_areas && member.practice_areas.length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-main mb-6 border-b-4 border-main pb-3">
              Practice Areas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {member.practice_areas.map((area, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-main flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{area}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Biography */}
        {member.biography && (
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-main mb-6 border-b-4 border-main pb-3">
              Biography
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {member.biography}
              </p>
            </div>
          </div>
        )}

        {/* Education */}
        {member.education && member.education.length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-main mb-6 border-b-4 border-main pb-3">
              Education
            </h2>
            <ul className="space-y-3">
              {member.education.map((edu, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-main shrink-0 mt-2.5" />
                  <span className="text-gray-700 leading-relaxed">{edu}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}