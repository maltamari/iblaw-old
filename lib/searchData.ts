
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'PAGE' | 'PRACTICE' | 'SECTOR' | 'TEAM' | 'CAREER';
  icon: 'file' | 'briefcase' | 'bookmark' | 'users' | 'graduation';
  href: string;
}

export const allSearchResults: SearchResult[] = [
  // ==================== PAGES ====================
  {
    id: 'page-home',
    title: 'Home',
    description: 'Main homepage with all services',
    type: 'PAGE',
    icon: 'file',
    href: '/'
  },
  {
    id: 'page-about',
    title: 'About Us',
    description: 'Learn about IBLAW and our history',
    type: 'PAGE',
    icon: 'file',
    href: '/about'
  },
  {
    id: 'page-practices',
    title: 'Practices & Sectors',
    description: 'All our legal practice areas and industry sectors',
    type: 'PAGE',
    icon: 'file',
    href: '/practices'
  },
  {
    id: 'page-team',
    title: 'Our Team',
    description: 'Meet our partners, associates, and team members',
    type: 'PAGE',
    icon: 'file',
    href: '/team'
  },
  {
    id: 'page-careers',
    title: 'Careers',
    description: 'Join our team - current openings and opportunities',
    type: 'PAGE',
    icon: 'file',
    href: '/careers'
  },
  {
    id: 'page-contact',
    title: 'Contact Us',
    description: 'Get in touch with IBLAW',
    type: 'PAGE',
    icon: 'file',
    href: '#contact'
  },

  // ==================== PRACTICES ====================
  {
    id: 'practice-corporate',
    title: 'Corporate & Commercial',
    description: 'We protect your business interests, so you can focus on growth.',
    type: 'PRACTICE',
    icon: 'briefcase',
    href: '/practices/corporate-commercial'
  },
  {
    id: 'practice-banking',
    title: 'Banking & Finance',
    description: 'We protect your business interests, so you can focus on growth.',
    type: 'PRACTICE',
    icon: 'briefcase',
    href: '/practices/banking-finance'
  },
  {
    id: 'practice-dispute',
    title: 'Dispute Resolution',
    description: 'Clear strategy. Results you can trust.',
    type: 'PRACTICE',
    icon: 'briefcase',
    href: '/practices/dispute-resolution'
  },
  {
    id: 'practice-capital',
    title: 'Capital Markets & Securities',
    description: 'Guidance for issuers and investors on offerings and disclosure obligations.',
    type: 'PRACTICE',
    icon: 'briefcase',
    href: '/practices/capital-markets-securities'
  },
  {
    id: 'practice-employment',
    title: 'Employment & Labor',
    description: 'Practical legal support for contracts, policies, and workforce compliance.',
    type: 'PRACTICE',
    icon: 'briefcase',
    href: '/practices/employment-labor'
  },
  {
    id: 'practice-ip',
    title: 'Intellectual Property',
    description: 'Comprehensive IP solutions for businesses and individuals.',
    type: 'PRACTICE',
    icon: 'briefcase',
    href: '/practices/intellectual-property'
  },
  {
    id: 'practice-realestate',
    title: 'Real Estate & Development',
    description: 'End-to-end support for acquisitions, leasing, and development.',
    type: 'PRACTICE',
    icon: 'briefcase',
    href: '/practices/real-estate-development'
  },
  {
    id: 'practice-tax',
    title: 'Taxation',
    description: 'Strategic tax advisory and compliance.',
    type: 'PRACTICE',
    icon: 'briefcase',
    href: '/practices/taxation'
  },
  {
    id: 'practice-policy',
    title: 'Public Policy & Legislative Drafting',
    description: 'Comprehensive regulatory solutions for dynamic markets.',
    type: 'PRACTICE',
    icon: 'briefcase',
    href: '/practices/public-policy-legislative'
  },
  {
    id: 'practice-privatization',
    title: 'Privatization & Public Procurement',
    description: 'Advising on PPPs, concessions, and tender processes.',
    type: 'PRACTICE',
    icon: 'briefcase',
    href: '/practices/privatization-public-procurement'
  },
  {
    id: 'practice-governance',
    title: 'Corporate Governance & Compliance',
    description: 'Strengthening organizations with effective governance frameworks.',
    type: 'PRACTICE',
    icon: 'briefcase',
    href: '/practices/corporate-governance-compliance'
  },

  // ==================== SECTORS ====================
  {
    id: 'sector-energy',
    title: 'Energy',
    description: 'Advising on the legal and regulatory landscape across energy projects.',
    type: 'SECTOR',
    icon: 'bookmark',
    href: '/practices/energy'
  },
  {
    id: 'sector-telecom',
    title: 'Telecommunications, Technology & Media',
    description: 'Legal solutions for telecom, technology, and media sectors.',
    type: 'SECTOR',
    icon: 'bookmark',
    href: '/practices/telecommunications'
  },
  {
    id: 'sector-financial',
    title: 'Financial Services',
    description: 'Legal advisory for banks, fintechs, and financial institutions.',
    type: 'SECTOR',
    icon: 'bookmark',
    href: '/practices/financial-services'
  },
  {
    id: 'sector-government',
    title: 'Government & Public Sector',
    description: 'Partnering with public institutions on reform and legislation.',
    type: 'SECTOR',
    icon: 'bookmark',
    href: '/practices/government'
  },
  {
    id: 'sector-zones',
    title: 'Special Economic Zones & Free Zones',
    description: 'Supporting businesses operating in Special and Free Zones.',
    type: 'SECTOR',
    icon: 'bookmark',
    href: '/practices/special-economic-zones'
  },
  {
    id: 'sector-infrastructure',
    title: 'Infrastructure & Project Development',
    description: 'Advising on procurement, financing, and infrastructure projects.',
    type: 'SECTOR',
    icon: 'bookmark',
    href: '/practices/infrastructure'
  },

  // ==================== TEAM MEMBERS ====================
  {
    id: 'team-salaheddin',
    title: 'Dr. Salaheddin Al Bashir',
    description: 'Senior Partner & Founder - Leadership',
    type: 'TEAM',
    icon: 'users',
    href: '/team#partners'
  },
  {
    id: 'team-nancy',
    title: 'Nancy Dababneh',
    description: 'Partner – Head of Intellectual Property Department',
    type: 'TEAM',
    icon: 'users',
    href: '/team#partners'
  },
  {
    id: 'team-firas',
    title: 'Firas Malhas',
    description: 'Partner - Corporate & Commercial',
    type: 'TEAM',
    icon: 'users',
    href: '/team#partners'
  },
  {
    id: 'team-salim',
    title: 'Salim Kopti',
    description: 'Partner - Litigation',
    type: 'TEAM',
    icon: 'users',
    href: '/team#partners'
  },
  {
    id: 'team-eman',
    title: 'Eman Al-Dabbas',
    description: 'Of Counsel - Public Policy & Regulatory',
    type: 'TEAM',
    icon: 'users',
    href: '/team#partners'
  },

  // ==================== CAREERS ====================
  {
    id: 'career-associate',
    title: 'Associate Attorney',
    description: 'Corporate & Commercial - Full-time position in Amman, Jordan',
    type: 'CAREER',
    icon: 'graduation',
    href: '/careers#positions'
  },
  {
    id: 'career-ip',
    title: 'Intellectual Property Associate',
    description: 'Intellectual Property - Full-time position in Amman, Jordan',
    type: 'CAREER',
    icon: 'graduation',
    href: '/careers#positions'
  },
  {
    id: 'career-litigation',
    title: 'Litigation Associate',
    description: 'Dispute Resolution - Full-time position in Amman, Jordan',
    type: 'CAREER',
    icon: 'graduation',
    href: '/careers#positions'
  },
  {
    id: 'career-trainee',
    title: 'Trainee Attorney',
    description: 'Multiple Departments - Internship opportunity in Amman, Jordan',
    type: 'CAREER',
    icon: 'graduation',
    href: '/careers#positions'
  },
  {
    id: 'career-culture',
    title: 'Life at IBLAW - Our Culture',
    description: 'Built on excellence, integrity, and innovation',
    type: 'CAREER',
    icon: 'graduation',
    href: '/careers#culture'
  },
  {
    id: 'career-benefits',
    title: 'Benefits & Perks',
    description: 'Competitive packages, health insurance, and professional development',
    type: 'CAREER',
    icon: 'graduation',
    href: '/careers#benefits'
  },
  {
    id: 'career-training',
    title: 'Training & Development',
    description: 'Comprehensive programs for all career levels',
    type: 'CAREER',
    icon: 'graduation',
    href: '/careers#training'
  }
];