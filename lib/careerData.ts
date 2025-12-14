import { LucideIcon,Award,Heart,Sparkles,Users,PartyPopper, GraduationCap, Globe, Handshake, Scale, TrendingUp,HeartHandshake } from 'lucide-react';

interface Section {
  icon: LucideIcon;
  title: string;
  description?: string[];
  items?: string[];
}

export const positions = [
  "Associate Attorney",
  "Intellectual Property Associate",
  "Litigation Associate",
  "Trainee Attorney",
  "Other",
];

export const jobListings = [
  {
    id: 1,
    title: "Associate Attorney",
    department: "Corporate & Commercial",
    location: "Amman, Jordan",
    type: "Full-time",
    description:
      "We are seeking a motivated associate attorney to join our Corporate & Commercial department. The ideal candidate will have hands-on experience handling corporate law matters, M&A transactions, and commercial agreements.",
    requirements: [
      "LLB or equivalent law degree",
      "2–4 years of experience in corporate law",
      "Excellent written and oral communication skills in English and Arabic",
      "Strong analytical and problem-solving abilities",
      "Admitted to practice law in Jordan"
    ]
  },
  {
    id: 2,
    title: "Intellectual Property Associate",
    department: "Intellectual Property",
    location: "Amman, Jordan",
    type: "Full-time",
    description:
      "Join our leading Intellectual Property practice and work on trademark, patent, and copyright matters for major multinational and local clients across various industries.",
    requirements: [
      "LLB with a focus on intellectual property law preferred",
      "1–3 years of IP-related experience",
      "Knowledge of IP registration processes",
      "Experience with IP litigation is a plus"
    ]
  },
  {
    id: 3,
    title: "Litigation Associate",
    department: "Dispute Resolution",
    location: "Amman, Jordan",
    type: "Full-time",
    description:
      "We are seeking an experienced litigation associate to join our dispute resolution team, handling complex commercial disputes and arbitration matters.",
    requirements: [
      "LLB or equivalent law degree",
      "3–5 years of litigation experience",
      "Court appearance experience required",
      "Strong research and drafting skills"
    ]
  },
  {
    id: 4,
    title: "Trainee Attorney",
    department: "Multiple Departments",
    location: "Amman, Jordan",
    type: "Internship",
    description:
      "IBLAW offers a structured and comprehensive training program for recent law graduates, providing rotational exposure across multiple practice areas to build a strong legal foundation.",
    requirements: [
      "Recent LLB graduate",
      "Strong academic record",
      "Fluency in English and Arabic",
      "Commitment to the legal profession"
    ]
  }
];

export const lifeAtIBLAW = [
  {
    icon: PartyPopper,
    title: "Our Culture",
    description:
      "IBLAW’s culture is built on excellence, integrity, and innovation. We value diverse perspectives, encourage creativity, and support continuous professional growth. Our collaborative environment promotes knowledge sharing and strong, lasting relationships with colleagues and clients."
  },
  {
    icon: Users,
    title: "Team Structure",
    description:
      "Our firm is organized into specialized practice-area departments, each led by a partner and supported by dedicated teams of experienced attorneys. This structure allows us to deliver holistic legal advice while promoting collaboration and shared expertise across departments."
  },
  {
    icon: GraduationCap,
    title: "Training & Development",
    description:
      "We are committed to developing our people at every stage of their careers through structured onboarding, regular in-house training, mentorship programs, external professional development opportunities, and access to leading legal research resources."
  },
  {
    icon: HeartHandshake,
    title: "Benefits & Perks",
    description:
      "IBLAW offers competitive salary packages, health insurance coverage, annual leave, flexible working options where applicable, professional development allowances, covered bar association fees, and a modern, technology-enabled work environment."
  }
];

export const whyJoinReasons = [
  {
    icon: GraduationCap,
    title: "Professional Development",
    description:
      "At IBLAW, we invest in our people through structured training programs, hands-on mentorship, and continuous learning opportunities. Our clear career development paths support both professional and personal growth."
  },
  {
    icon: Award,
    title: "Prestigious Practice",
    description:
      "Work on high-profile and complex matters alongside leading corporations, government entities, and international organizations. IBLAW’s strong reputation ensures meaningful exposure from day one."
  },
  {
    icon: Handshake,
    title: "Collaborative Culture",
    description:
      "Be part of a team that values collaboration over competition. Our open-door policy and cross-departmental knowledge-sharing culture encourage innovation, teamwork, and excellence."
  },
  {
    icon: Globe,
    title: "Regional & International Exposure",
    description:
      "Gain valuable experience working on regional and international legal matters. IBLAW’s practice extends across the MENA region and beyond, offering exposure to cross-border transactions and disputes."
  },
  {
    icon: Scale,
    title: "Work-Life Balance",
    description:
      "We believe in sustainable performance. While we deliver excellence for our clients, we also support work-life balance through a professional and flexible working environment where possible."
  },
  {
    icon: TrendingUp,
    title: "Competitive Compensation",
    description:
      "IBLAW offers competitive salaries and benefits packages that reflect our commitment to attracting, developing, and retaining top legal talent."
  }
];

export  const sections: Section[] = [
    {
      icon: Sparkles,
      title: 'Our Culture',
      description: [
        "IBLAW's culture is built on excellence, integrity, and innovation. We foster an environment where diverse perspectives are valued, creativity is encouraged, and professional growth is supported. Our team members come from varied backgrounds, bringing unique experiences and viewpoints that enrich our practice and service to clients.",
        "We believe in maintaining the highest ethical and professional standards while building strong relationships with our colleagues and clients. The firm's open and collaborative approach means that knowledge sharing is embedded in our daily practice."
      ]
    },
    {
      icon: Users,
      title: 'Team Structure',
      description: [
        "The firm is organized by practice areas and divided into departments, each led by a partner and supported by fully dedicated teams of specialized attorneys. This structure enables us to provide holistic legal advice by leveraging insights from multiple relevant departments.",
        "Our team culture and practice management style ensure resource and experience sharing across departments whenever needed, for the benefit of our clients and professional development of our attorneys."
      ]
    },
    {
      icon: Award,
      title: 'Training & Development',
      description: ["We offer comprehensive training programs for all levels:"],
      items: [
        'Structured onboarding for new joiners',
        'Regular in-house training sessions',
        'Mentorship programs pairing junior lawyers with senior partners',
        'Support for external professional development courses',
        'Opportunities to attend and present at conferences',
        'Access to leading legal research databases and resources'
      ]
    },
    {
      icon: Heart,
      title: 'Benefits & Perks',
      items: [
        'Competitive salary packages',
        'Health insurance coverage',
        'Annual leave and flexible working options',
        'Professional development allowances',
        'Bar association membership fees covered',
        'Modern office environment with latest technology'
      ]
    }
  ];