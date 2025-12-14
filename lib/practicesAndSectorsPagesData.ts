import {
  Briefcase,
  Building2,
  Scale,
  TrendingUp,
  Users,
  Lightbulb,
  Building,
  Calculator,
  ScrollText,
  ShoppingCart,
  CheckCircle2,
  Zap,
  Radio,
  Landmark,
  Globe,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ---------------- TYPES ---------------- */

export type UnifiedItem = {
  slug: string;
  title: string;
  Icon: LucideIcon;
  description: string;
  details: string;
  type: "practice" | "sector";
};

/* ---------------- BASE (NAVIGATION) ---------------- */

export const practicesAndSectorsBase = [
  { slug: "corporate-commercial", title: "Corporate & Commercial", Icon: Briefcase },
  { slug: "banking-finance", title: "Banking & Finance", Icon: Building2 },
  { slug: "dispute-resolution", title: "Dispute Resolution", Icon: Scale },
  { slug: "capital-markets-securities", title: "Capital Markets & Securities", Icon: TrendingUp },
  { slug: "employment-labor", title: "Employment & Labor", Icon: Users },
  { slug: "intellectual-property", title: "Intellectual Property", Icon: Lightbulb },
  { slug: "real-estate-development", title: "Real Estate & Development", Icon: Building },
  { slug: "taxation", title: "Taxation", Icon: Calculator },
  { slug: "public-policy-legislative", title: "Public Policy & Legislative Drafting", Icon: ScrollText },
  { slug: "privatization-public-procurement", title: "Privatization & Public Procurement", Icon: ShoppingCart },
  { slug: "corporate-governance-compliance", title: "Corporate Governance & Compliance", Icon: CheckCircle2 },

  { slug: "energy", title: "Energy", Icon: Zap },
  { slug: "telecommunications", title: "Telecommunications, Technology & Media", Icon: Radio },
  { slug: "financial-services", title: "Financial Services", Icon: Landmark },
  { slug: "government", title: "Government & Public Sector", Icon: Building2 },
  { slug: "special-economic-zones", title: "Special Economic Zones & Free Zones", Icon: Globe },
  { slug: "infrastructure", title: "Infrastructure & Project Development", Icon: Wrench },
];

/* ---------------- PRACTICES MAP ---------------- */

const practicesMap: Record<
  string,
  { type: "practice"; description: string; details: string }
> = {
  "corporate-commercial": {
    type: "practice",
    description: "We protect your business interests, so you can focus on growth.",
    details:
      "IBLAW's corporate and commercial practice has been recognized year after year as a market leader, providing comprehensive corporate services locally, regionally, and internationally.",
  },
  "banking-finance": {
    type: "practice",
    description: "We protect your business interests, so you can focus on growth.",
    details:
      "IBLAW advises domestic and international banks on complex banking and finance transactions, including project finance and structured lending.",
  },
  "dispute-resolution": {
    type: "practice",
    description: "Clear strategy. Results you can trust.",
    details:
      "We assist clients through litigation, arbitration, and alternative dispute resolution, delivering practical and effective outcomes.",
  },
  "capital-markets-securities": {
    type: "practice",
    description:
      "Guidance for issuers and investors on offerings and disclosure obligations.",
    details:
      "Our team advises on IPOs, listings, underwriting, and securities trading under Jordanian securities laws.",
  },
  "employment-labor": {
    type: "practice",
    description:
      "Practical legal support for contracts, policies, and workforce compliance.",
    details:
      "We advise on labor law, employment contracts, internal policies, and represent clients in employment disputes.",
  },
  "intellectual-property": {
    type: "practice",
    description:
      "Comprehensive Intellectual Property solutions for businesses and individuals.",
    details:
      "IBLAW is a leader in trademarks, patents, and copyright matters, shaping the IP landscape in Jordan.",
  },
  "real-estate-development": {
    type: "practice",
    description:
      "End-to-end support for acquisitions, leasing, and development.",
    details:
      "We have advised on major real estate developments during Jordan’s real estate investment boom.",
  },
  taxation: {
    type: "practice",
    description: "Strategic tax advisory and compliance.",
    details:
      "We represent clients in income tax, sales tax, customs duties disputes, and regulatory compliance.",
  },
  "public-policy-legislative": {
    type: "practice",
    description: "Comprehensive regulatory solutions for dynamic markets.",
    details:
      "Our public policy team has deep insight into governmental operations and legislative drafting.",
  },
  "privatization-public-procurement": {
    type: "practice",
    description:
      "Advising on PPPs, concessions, and tender processes.",
    details:
      "IBLAW plays a key role in advisory services related to Jordan’s privatization initiatives.",
  },
  "corporate-governance-compliance": {
    type: "practice",
    description:
      "Strengthening organizations with effective governance frameworks.",
    details:
      "We advise on regulatory requirements and compliance to maintain good corporate standing.",
  },
};

/* ---------------- SECTORS MAP ---------------- */

const sectorsMap: Record<
  string,
  { type: "sector"; description: string; details: string }
> = {
  energy: {
    type: "sector",
    description:
      "Advising on the legal and regulatory landscape across energy projects.",
    details:
      "IBLAW advises on energy projects covering development, financing, acquisition, and regulation across oil, gas, and renewables.",
  },
  telecommunications: {
    type: "sector",
    description:
      "Legal solutions for telecom, technology, and media sectors.",
    details:
      "We advise on regulatory and transactional matters across telecom, technology, and major infrastructure projects.",
  },
  "financial-services": {
    type: "sector",
    description:
      "Legal advisory for banks, fintechs, and financial institutions.",
    details:
      "Our lawyers have direct experience advising regional and international financial institutions.",
  },
  government: {
    type: "sector",
    description:
      "Partnering with public institutions on reform and legislation.",
    details:
      "We maintain strong relationships across government entities and international agencies.",
  },
  "special-economic-zones": {
    type: "sector",
    description:
      "Supporting businesses operating in Special and Free Zones.",
    details:
      "IBLAW contributed to drafting the legislative framework for the Aqaba Special Economic Zone.",
  },
  infrastructure: {
    type: "sector",
    description:
      "Advising on procurement, financing, and infrastructure projects.",
    details:
      "We have extensive experience across BOT and BOO infrastructure privatization projects.",
  },
};

/* ---------------- FINAL MERGED ARRAY ---------------- */

export const unifiedPracticesAndSectors: UnifiedItem[] =
  practicesAndSectorsBase.map((item) => {
    const extra = practicesMap[item.slug] || sectorsMap[item.slug];

    if (!extra) {
      throw new Error(`Missing data for slug: ${item.slug}`);
    }

    return {
      slug: item.slug,
      title: item.title,
      Icon: item.Icon,
      description: extra.description,
      details: extra.details,
      type: extra.type,
    };
  });
