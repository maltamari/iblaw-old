import {
  Award,
  Scale,
  Lightbulb,
  Home,
  Users,
  Globe,
  Shield,
  Handshake,
  Building2,
  Info,
  Briefcase,
  Phone
} from "lucide-react";
import React from "react";

type Links = {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
};

interface Section {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  details: string;
}

/* ---------------------- QUICK LINKS ---------------------- */

export const quickLinks: Links[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "About Us", href: "/about", icon: Info },
  { name: "Practices & Sectors", href: "/practices", icon: Scale },
  { name: "Our Team", href: "/team", icon: Users },
  { name: "Careers", href: "/careers", icon: Briefcase },
  { name: "Contact Us", href: "#contact", icon: Phone },
];

/* ---------------------- SITE LINKS ---------------------- */

export const siteLinks: Links[] = [
  { name: "Disclaimer", href: "/disclaimer" },
  { name: "Terms & Condition", href: "/terms" },
  { name: "Cookies Used", href: "/cookies" },
];

/* ---------------------- SLIDES ---------------------- */

export const slides = [
  [
    {
      icon: Award,
      title: "Corporate & Commercial",
      description: "We protect your business interests, so you can focus on growth.",
    },
    {
      icon: Building2,
      title: "Banking & Finance",
      description: "Banking & Finance Legal Excellence",
    },
    {
      icon: Scale,
      title: "Dispute Resolution",
      description: "Clear strategy. Results you can trust",
    },
  ],
  [
    {
      icon: Lightbulb,
      title: "Intellectual Property",
      description: "Protecting your innovations and creative works",
    },
    {
      icon: Home,
      title: "Real Estate",
      description: "Comprehensive property law solutions",
    },
    {
      icon: Users,
      title: "Employment Law",
      description: "Expert guidance on workplace matters",
    },
  ],
  [
    {
      icon: Globe,
      title: "International Trade",
      description: "Navigating global business regulations",
    },
    {
      icon: Shield,
      title: "Compliance",
      description: "Ensuring regulatory adherence",
    },
    {
      icon: Handshake,
      title: "Mergers & Acquisitions",
      description: "Strategic transaction support",
    },
  ],
];

/* ---------------------- ARTICLES ---------------------- */

export const articles = [
  {
    category: "Category",
    image: "/business1.jpg",
    date: "08/05/2023",
    title: "How To Build New Business In Modern Era",
    excerpt: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
  },
  {
    category: "Category",
    image: "/business2.jpg",
    date: "08/05/2023",
    title: "What The Business Knowladge Service",
    excerpt: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
  },
  {
    category: "Category",
    image: "/business3.jpg",
    date: "08/05/2023",
    title: "Tips Fast Growing Your Business Brand",
    excerpt: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
  },
];

/* ---------------------- SECTORS ---------------------- */


/* ---------------------- PARTNERS ---------------------- */
export const partners = [
  {
    name: "Dr. Salaheddin Al Bashir",
    role: "Senior Partner & Founder",
    department: "Leadership",
  },
  {
    name: "Nancy Dababneh",
    role: "Partner – Head of Intellectual Property Department",
    department: "Intellectual Property",
  },
  {
    name: "Firas Malhas",
    role: "Partner",
    department: "Corporate & Commercial",
  },
  {
    name: "Salim Kopti",
    role: "Partner",
    department: "Litigation",
  },
  {
    name: "Eman Al-Dabbas",
    role: "Of Counsel",
    department: "Public Policy & Regulatory",
  },
];
/* ---------------------- ASSOCIATES ---------------------- */
export const associates = [
  {
    name: "Ayman Al Akroush",
    role: "Senior Associate",
    department: "Litigation",
  },
  {
    name: "Dina Al-Bashir",
    role: "Senior Associate",
    department: "Intellectual Property",
  },
  {
    name: "Mohammad Al-Alqan",
    role: "Senior Associate",
    department: "Litigation",
  },
  {
    name: "Osama Mistarihi",
    role: "Senior Associate",
    department: "Intellectual Property",
  },
  {
    name: "Mohammed Najdawi",
    role: "Senior Associate",
    department: "Corporate & Commercial",
  },
  {
    name: "Samer Billeh",
    role: "Senior Associate",
    department: "Litigation",
  },
  {
    name: "Anoud Kopti",
    role: "Associate",
    department: "Corporate & Commercial",
  },
  {
    name: "Zaina Nasser",
    role: "Associate",
    department: "Corporate & Commercial",
  },
  {
    name: "Lara Mdanat",
    role: "Associate",
    department: "Corporate & Commercial",
  },
  {
    name: "Tayma Abu Abboud",
    role: "Associate",
    department: "Litigation",
  },
  {
    name: "Al-Hareth Quteishat",
    role: "Associate",
    department: "Litigation",
  },
  {
    name: "Tasneem Kheshman",
    role: "Associate",
    department: "Intellectual Property",
  },
  {
    name: "Izzat Tbakhi",
    role: "Associate",
    department: "Litigation & Arbitration",
  },
  {
    name: "Aseel Al-Rawashdeh",
    role: "Associate",
    department: "Public Policy & Arbitration",
  },
  {
    name: "Tala Al-Aksheh",
    role: "Associate",
    department: "Corporate & Commercial",
  },
  {
    name: "Youssor Abu Saleem",
    role: "Associate",
    department: "Litigation",
  },
];

/* ---------------------- MANAGEMENT ---------------------- */
export const management = [
  {
    name: "Bothaina Musa",
    role: "Manager",
    department: "Finance & Administration",
  },
  {
    name: "Hadeel Al Haj",
    role: "Manager",
    department: "Operations",
  },
  {
    name: "Mohammed Qurashi",
    role: "Manager",
    department: "Finance",
  },
  {
    name: "Nader Jaber",
    role: "Manager",
    department: "Administration",
  },
];
/* ---------------------- TRAINEES ---------------------- */
export const trainees = [
  { name: "Nour Al-Najdawi", role: "Trainee", department: "Litigation" },
  { name: "Miral Musharbash", role: "Trainee", department: "Litigation" },
  { name: "Jasmin Saleh", role: "Trainee", department: "Litigation" },
  { name: "Ra'ad Spasioti", role: "Trainee", department: "Corporate & IP" },
  { name: "Abdalfattah Al-Awamleh", role: "Trainee", department: "Litigation" },
  { name: "Zaid Salman Qaryouti", role: "Trainee", department: "Litigation" },
  { name: "Mohammed Al-Shakhanbeh", role: "Trainee", department: "Litigation" },
  { name: "Ahmad Hawartheh", role: "Trainee", department: "Litigation" },
  { name: "Abedalrahman Al-Awamleh", role: "Trainee", department: "Litigation" },
  { name: "Asem Al Hussein", role: "Trainee", department: "Litigation" },
  { name: "Naser Al Nabelsi", role: "Trainee", department: "Litigation" },
  { name: "Jude Kopti", role: "Trainee", department: "Litigation" },
];
