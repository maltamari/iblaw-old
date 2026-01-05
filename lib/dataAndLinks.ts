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

/* ---------------------- Footer LINKS ---------------------- */
export const footerLinks: Links[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "About Us", href: "/about", icon: Info },
  { name: "Practices & Sectors", href: "/practices", icon: Scale },
  { name: "Our Team", href: "/team", icon: Users },
  { name: "Careers", href: "/careers", icon: Briefcase },
  { name: "News & Awards", href: "/news-awards", icon: Phone },
];
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



