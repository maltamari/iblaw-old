import { 
  Briefcase, Building2, Scale, TrendingUp, Users, Lightbulb, 
  Building, Calculator, ScrollText, ShoppingCart, CheckCircle2, 
  Zap, Radio, Landmark, Globe, Wrench ,LucideIcon
} from 'lucide-react'

export interface PracticeData {
  slug: string
  title: string
  icon: LucideIcon
  heroImage: string

  shortDescription: string
  fullDescription: string
  description2?: string
  description3?: string 
  // Common
  services?: string[]

  // Intellectual Property
  advisoryServices?: string[]
  ipAgreements?: string[]
  litigationAndProsecution?: string[]
  additionalServices?: string[]

  // Telecommunications
  itSectorExperience?: string[]

  // Government
  keyRelationships?: string[]

  // Infrastructure
  majorProjectExperience?: string[]
  sectorFocus?: string[]

  // Special Economic Zones
  aqabaSpecialEconomicZoneRole?: string[]
  saudiArabiaMegaProjects?: string[]

  // Privatization & PPP
  coreServices?: string[]
  energyAndElectricity?: string[]
  transportation?: string[]
  waterAndUtilities?: string[]

  // Corporate Governance
  governanceAdvisory?: string[]
  complianceAndRegulatory?: string[]
  internalControlsAndPolicies?: string[]
  disputeAndRepresentation?: string[]

  // Public Policy & Legislative
  accomplishments?: {
    jordan?: string[]
    regional?: string[]
    saudiArabiaAndGulf?: string[]
  }
}

export const practicesData: Record<string, PracticeData> = {
'employment-labor': {
  slug: 'employment-labor',
  title: 'Employment & Labor',
  icon: Users,
  heroImage: '/HeroPractices.png',
  shortDescription:
    'Practical legal support for contracts, policies, disputes, and workforce compliance.',
  fullDescription:
    'We assist clients in all employee legal affairs, including advising on labor law, civil service, tax and social security matters, drafting employment contracts and internal manuals, and representation in disputes. We also help implement labor transfer and employee stock option plans, and assist family businesses in enhancing governance by separating family ownership from management and control.',
  description2:
    'Our employment and labor practice provides comprehensive legal support across all aspects of the employment relationship, from hiring through termination, ensuring compliance with Jordan\'s labor laws and regulations while protecting our clients\' business interests.',
  services: [
    'Civil Service matters',
    'Employment Litigation',
    'Employment Termination',
    'Labor Arbitration',
    'Labor Contracts',
    'Labor Law Advisory',
    'Labor Legislation',
    'Labor Relations',
    'Labor Strikes',
    'Labor Taxation',
    'Unfair Labor Practices',
    'Employee Stock Option Plans',
    'Internal Policies and Manuals',
    'Social Security Compliance',
  ],
},
  'corporate-commercial': {
  slug: 'corporate-commercial',
  title: 'Corporate & Commercial',
  icon: Briefcase,
  heroImage: '/HeroPractices.png',

  shortDescription:
    'We protect your business interests, so you can focus on growth.',

  fullDescription:
  'IBLAW’s corporate and commercial practice has been recognized year after year as a leader in the market. Under this practice group we provide a broad range of corporate and business services to publicly held corporations and private businesses, locally, regionally, and internationally. We serve as general counsel for corporations and represent them in all aspects of their corporate life from the establishment of the enterprise through all stages of operation and evolution.',

description2:
  'We provide services including private-public participation projects (PPP) and project finance, corporate taxation and finance, mergers and acquisitions, venture capital investments, real estate development, leasing, corporate compliance and governance, labor and employment, and securities and capital markets. Additionally, we are active in domestic and cross-border corporate transactions, major mergers, acquisitions and joint ventures, as well as private equity and venture capital investments. IBLAW has extensive expertise in drafting complex multi-party infrastructure, utilities and real estate development agreements and concessions.',

description3:
  'Our expertise in the Jordanian legal structure allows us to serve our corporate clients in the best way. Additionally, the firm is integrally involved in legal reform and legislative drafting, allowing it to shape the legal infrastructure itself. IBLAW has had the opportunity and privilege to participate in Jordan\'s impressive privatization effort, which has changed the landscape of the Jordanian economy. Building on its experience in Jordan, IBLAW has also advised several other governments on various legal aspects of privatization initiatives and transactions.',

  services: [
    'Corporate Registration',
    'Corporate Restructuring',
    'Corporate Structuring',
    'Corporate Litigation',
    'Corporate Partnership',
    'International Corporate Finance',
    'International Corporate Law',
    'Joint Ventures Limited Liability',
    'Liquidation',
    'Merger and Acquisition',
    'Securitization',
  ],
}

,
  'banking-finance': {
  slug: 'banking-finance',
  title: 'Banking & Finance',
  icon: Building2,
  heroImage: '/HeroPractices.png',
  shortDescription:
    'Banking & Finance legal excellence for complex transactions and regulatory matters.',
  fullDescription:
    'IBLAW advises domestic and international banks and financial institutions on specialized and complex banking and financial transactions, including syndicated loans, project and structured finance, and secured debt. Our team includes several attorneys with direct work experience as legal advisers to reputable local and international banks and financial institutions.',
  description2:
    'The firm’s Banking and Finance Department specializes in securities and capital markets and taxation. Our team also has extensive experience in trade finance, documentary credit, financial leasing, and cross-border finance, providing practical and commercially focused legal solutions. With deep knowledge of the Jordanian regulatory framework, we assist clients in navigating evolving banking and financial regulations and restructuring matters.',
  services: [
    'Banking Contracts',
    'Banking Law',
    'Banking Litigation',
    'Banking Regulation',
    'Banking Securities',
    'Banking Taxation',
    'Commercial Finance',
    'Cross-Border Finance',
    'Debt and Equity Finance',
    'Financial Structuring',
    'Financial Restructuring',
    'Financial Institution Bonds',
    'Financial Institutions Insolvency',
    'Financial Institutions Law',
    'Financial Institutions Regulation',
    'Financial Institutions Taxation',
  ],
}
,
  'dispute-resolution': {
  slug: 'dispute-resolution',
  title: 'Dispute Resolution',
  icon: Scale,
  heroImage: '/HeroPractices.png',
  shortDescription:
    'Clear strategy. Results you can trust.',
fullDescription:
  'Major litigation can be a stressful journey involving high-risk exposure and unpredictable outcomes. We are committed to helping our clients identify and execute the most advantageous solutions through pursuing or defending litigation and arbitration proceedings, as well as alternative dispute resolution methods such as mediation. We work closely with clients to develop dispute resolution strategies tailored to their business needs, whether to resolve a dispute, protect a product or reputation, or limit financial exposure.',

description2:
  'IBLAW has an impressive record in major litigation before all trial and appellate courts in Jordan, as well as extensive experience in domestic and international arbitration. We represent clients in complex, multi-jurisdictional disputes across a wide range of industries, including labor and employment, construction, government procurement, banking and finance, insurance, real estate, intellectual property, distribution and agency, white-collar crime, and corporate fraud.',

description3:
  'The strength of our litigation and dispute resolution practice lies in our ability to take on some of the most difficult cases litigated or arbitrated locally and internationally for high-profile clients. We work effectively with in-house legal teams and co-counsel to build and manage the teams required for large-scale litigations and arbitrations.',

    services: [
    'Arbitration',
    'International Arbitration',
    'International Dispute Resolution',
    'International Mediation',
    'Mediation',
    'International Commercial Litigation',
    'Civil Litigation',
    'International Litigation',
    'Insurance Litigation',
    'Media Litigation',
    'Enforcement of Judgments',
  ],
}
,
'intellectual-property': {
  slug: 'intellectual-property',
  title: 'Intellectual Property',
  icon: Lightbulb,
  heroImage: '/HeroPractices.png',

  shortDescription:
    'Comprehensive intellectual property solutions for businesses and individuals.',

fullDescription:
  'IBLAW has played a significant role in shaping the Intellectual Property Rights regime in Jordan, distinguishing itself as a leader in this field. Thanks to its role in drafting and advocating the Kingdom\'s TRIPS-compliant IP package of legislation, the firm enjoys a competitive advantage in advising on all aspects of intellectual property rights in Jordan.',

description2:
  'We serve clients across a wide range of industries including cosmetics and luxury goods, confectioneries, auto parts and machinery, tobacco, IT and telecommunications, media and advertising, software, distribution and retailing, publishing, and others.',

description3:
  'The firm’s cross-disciplinary approach to intellectual property work involves establishing and defending IP rights, regulatory counseling, managing IP portfolios, drafting IP-related agreements, and representation before courts and regulatory authorities. We provide comprehensive support to IP clients in areas such as corporate and commercial transactions, public policy and legislative drafting, and litigation and dispute resolution.',

  advisoryServices: [
    'Identification of Intellectual Property Rights',
    'Validity of Applications and Registrations',
    'Protection Requirements and Filing Policies',
    'Strategic Intellectual Property Protection',
    'IP Protection and Enforcement Strategies',
    'Market Expansion Strategies',
    'Antitrust and Unfair Competition Matters',
  ],

  ipAgreements: [
    'Assignment Agreements',
    'Licensing Agreements',
    'Franchising Agreements',
    'Mergers & Acquisitions Agreements',
    'Joint Venture Agreements',
    'Agency & Distribution Agreements',
    'Non-Disclosure and Confidentiality Agreements',
  ],

  litigationAndProsecution: [
    'Anti-Counterfeiting',
    'Infringement Actions',
    'Unfair Competition and Antitrust Litigation',
  ],

  additionalServices: [
    'Market Investigations and Street Services',
    'Local and International Trademark Watch Services',
    'IP Due Diligence Investigations',
    'Change of Name or Address for Trademark Registration',
    'Recording of Trademark Assignments',
    'Global Search and Clearance',
    'Cease & Desist and Cautionary Notices',
    'IP Portfolio Maintenance and Record-Keeping',
    'Intellectual Property Auditing and Valuation',
  ],
}

,
  'real-estate-development': {
  slug: 'real-estate-development',
  title: 'Real Estate & Development',
  icon: Building,
  heroImage: '/HeroPractices.png',
  shortDescription:
    'End-to-end support for acquisitions, leasing, development, and land use.',
  fullDescription:
    'Over the past decade, Jordan has witnessed an unprecedented boom in real estate development and investment, driving the need for sophisticated legal services to support increasingly complex development and finance models. IBLAW has been closely involved in this growth, advising major clients on large-scale real estate transactions and representing prominent real estate investors and developers.',
  description2:
    'Our Real Estate and Development practice provides comprehensive legal support across all aspects of property transactions, from initial acquisition through development, financing, leasing, and disposition. We understand the complexities of the regulatory environment and work closely with developers, investors, and financial institutions to structure and execute successful real estate projects while ensuring full compliance with applicable laws and regulations.',
  services: [
    'Property Acquisitions and Dispositions',
    'Real Estate Development Projects',
    'Commercial and Residential Leasing',
    'Land Use and Zoning Matters',
    'Real Estate Finance and Securitization',
    'Construction Agreements',
    'Property Management Agreements',
    'Title Due Diligence and Review',
    'Real Estate Regulatory Compliance',
  ],
}
,
  'capital-markets-securities': {
  slug: 'capital-markets-securities',
  title: 'Capital Markets & Securities',
  icon: TrendingUp,
  heroImage: '/HeroPractices.png',
  shortDescription:
    'Guidance for issuers and investors on offerings, listings, and disclosure obligations.',
  fullDescription:"We advise clients on all aspects of transactions governed by Jordan's Securities Laws and Regulations, including securities listing, share issuance and underwriting, initial public offerings, securities trading and dealings, corporate governance and disclosure requirements.",

  description2:"Furthermore, the firm has assisted in drafting Jordan's Securities Legislation and a proposed Securitization Law. Our comprehensive approach ensures that clients receive expert guidance throughout the entire lifecycle of securities transactions, from initial structuring through compliance and reporting.",
  services: [
    'Securities Listing and Exchange Regulations',
    'Share Issuance and Underwriting',
    'Initial Public Offerings (IPOs)',
    'Securities Trading and Dealings',
    'Corporate Governance Requirements',
    'Disclosure and Reporting Obligations',
    'Regulatory Compliance and Advisory',
    'Securitization Transactions',
  ],
}
,
  'taxation': {
  slug: 'taxation',
  title: 'Taxation',
  icon: Calculator,
  heroImage: '/HeroPractices.png',
  shortDescription:
    'Legal and strategic tax advice across corporate structuring, cross-border transactions, and compliance.',
  fullDescription:"We represent clients in tax disputes before the tax departments and other authorities. Our expertise covers employee and corporate income tax, customs duties, and sales tax. We also assist sector representatives in making sector-wide tax exemption claims.",
    description2:"We are particularly well-positioned to advise international clients on tax obligations, liabilities and exemptions, and work proactively with international projects, investors, and service providers to ensure tax compliance and avert tax complications.",
    
    services: [
    'Corporate Income Tax Planning and Compliance',
    'Employee Income Tax Matters',
    'Customs Duties and Import/Export Taxation',
    'Sales Tax and VAT Advisory',
    'Tax Dispute Resolution and Litigation',
    'Tax Exemption Claims and Applications',
    'Cross-Border Tax Structuring',
    'Tax Due Diligence for Transactions',
    'Tax Treaty Interpretation and Application',
    'Transfer Pricing Advisory',
    'Tax Compliance Audits and Reviews',
  ],
}
,
'public-policy-legislative': {
  slug: 'public-policy-legislative',
  title: 'Public Policy & Legislative Drafting',
  icon: ScrollText,
  heroImage: '/HeroPractices.png',

  shortDescription:
    'Comprehensive Regulatory Solutions for Dynamic Markets.',

fullDescription:
  'Our Public Policy and Legislative Drafting practice has a deep understanding of how the government operates and has fostered an extensive network including the Jordanian government, the private sector, and international agencies and donors.',

description2:
  'IBLAW provides comprehensive legal advice and consulting services to all stakeholders in the areas of public policy and legal reform. We are active in identifying public policy reform requirements, drafting, advocating, and implementing legislation. Our public policy team collaborates and builds on substantive knowledge across every practice area. Consequently, IBLAW has the expertise and capacity to provide legal support in various areas of public policy and legislative drafting such as international and multilateral trade agreements, public sector reform and restructuring, governance and the rule of law, economic and judicial reform, investment regimes, and special economic zones.',

description3:
  'To implement challenging long-term public policy projects, IBLAW has developed strong working relationships with international agencies and donors, including USAID, the European Commission, the World Bank, DFID, the United Nations Programs, and international subcontractors.',

  accomplishments: {
    jordan: [
      'Comprehensive legal support to Jordan’s World Trade Organization accession',
      'Advising the Government of Jordan in drafting and negotiating the United States–Jordan Free Trade Agreement',
      'Establishment of the Aqaba Special Economic Zone (ASEZ) – drafting more than 40 pieces of legislation',
      'Legislative reform in capital markets, telecommunications, and information technology',
      'Tourism, environmental policy, and civil service reform',
      'Public procurement and investment legislation',
      'Tax, securities, and public sector restructuring',
    ],

    regional: [
      'Drafting WTO-TRIPS compliant legislation for the Palestinian National Authority',
      'Legal survey of barriers to service trade in Tunisia',
      'Advising the American–Moroccan Chamber of Commerce on the Morocco–United States Free Trade Agreement',
    ],

    saudiArabiaAndGulf: [
      'Drafting of TRSDC and NEOM founding laws',
      'Strategic regulatory advice to the Royal Commission of Makkah',
      'Strategic regulatory advice to King Abdullah Financial District',
      'Participation in programs arising from Saudi Vision 2030',
      'Judicial reform initiative supervision and implementation across the Kingdom',
      'Establishment of special economic zones and drafting founding laws including independent judiciary frameworks',
    ],
  },
}

,
  'privatization-public-procurement': {
  slug: 'privatization-public-procurement',
  title: 'Privatization & Public Procurement',
  icon: ShoppingCart,
  heroImage: '/HeroPractices.png',

  shortDescription:
    'Advising on PPPs, concessions, and tender processes from strategy to award.',

  fullDescription:"The firm is heavily involved in advisory services related to the Kingdom's impressive privatization program spanning different utilities, sectors and services. Our team acts for both the government and private sector bidders in structuring and implementing privatization transactions ranging from the sale of government shares to more complex concessions, including Build-Operate-Transfer (BOT) and Build-Own-Operate (BOO) arrangements.",
  description2:"The firm has extensive experience with water, transportation and energy and electricity privatization projects. Some of our recent work includes advising the Aqaba Development Corporation on the multimillion Aqaba Port relocation project, advising an international consortium on the BOT bid for the expansion of the Queen Alia Airport, advising the Ministry of Transport on the BOT bid for the Amman Zarqa Light Railway and the privatization of the Aqaba Railway. The firm has also advised on the framework of private sector participation in the water and wastewater sector in Amman and Aqaba, and has been involved in several small privatization initiatives related to the Aqaba Container Terminal, public transport companies, and auxiliary aviation services.",
  coreServices: [
    'Privatization Transactions',
    'Public Procurement Advisory',
    'Public-Private Partnership (PPP) Structures',
    'Concession Agreements',
    'Government Contracts',
    'Tender Strategy and Bid Advisory',
    'Procurement Compliance and Regulatory Advisory',
    'Bid Protests and Procurement Disputes',
  ],

  energyAndElectricity: [
    'Privatization of Energy and Electricity Projects',
    'Independent Power Plant (IPP) Projects',
    'Regulatory Framework Restructuring',
    'Alternative and Renewable Energy Initiatives',
    'Advisory to Lending Institutions on Power Projects',
  ],

  transportation: [
    'Ports, Airports, and Railways Privatization',
    'Aqaba Container Terminal Privatization',
    'Aqaba Port Relocation Project',
    'Queen Alia International Airport Expansion (BOT)',
    'King Hussein Airport Commercialization Framework',
    'National Railway Network Advisory',
  ],

  waterAndUtilities: [
    'Private Sector Participation in Water and Wastewater Projects',
    'Water and Wastewater Management Frameworks',
    'Legal Studies for Privatization in the Water Sector',
    'Public-Private Participation Models in Infrastructure Utilities',
    'Advisory Roles for Government Entities and International Bidders',
  ],
}
,
'corporate-governance-compliance': {
  slug: 'corporate-governance-compliance',
  title: 'Corporate Governance & Compliance',
  icon: CheckCircle2,
  heroImage: '/HeroPractices.png',

  shortDescription:
    'Strengthening organizations with effective governance and seamless compliance solutions.',

  fullDescription:"We routinely advise our corporate clients on all government corporate and regulatory requirements to maintain good standing. Our experience covers, inter alia, board of directors responsibilities, board of directors and general assembly meetings, business licensing and compliance, and corporate disclosure and governance.",
  description2:"As in other areas, we act proactively and preventively but are highly competent and well experienced in representing executives and corporations in disputes related to the discharge of responsibilities and operations.",

services: [
  'Board of Directors Advisory and Governance',
  'General Assembly Meetings and Procedures',
  'Governance Framework Development',
  'Shareholder Rights and Relations',
  'Executive Responsibilities and Liability',
  'Business Licensing and Regulatory Compliance',
  'Corporate Disclosure Requirements',
  'Regulatory Reporting and Filings',
  'Compliance Audits and Assessments',
  'Risk Management and Compliance Programs',
  'Internal Controls and Policies',
  'Corporate Records Maintenance',
]

}
,
  'energy': {
  slug: 'energy',
  title: 'Energy',
  icon: Zap,
  heroImage: '/HeroPractices.png',

  shortDescription:
    'Advising on the legal and regulatory landscape across oil, gas, and renewable energy projects.',

  fullDescription:
    'IBLAW helps clients navigate the myriad of legal challenges that impact the energy sector in Jordan. The firm has extensive experience in all aspects of the development, financing, acquisition, and disposition of energy projects. We have represented major sponsors in the industry, handled high-profile transactions, and advised project lenders, equity investors, and acquirers and sellers of energy projects.',

  description2:
    'Our energy practice specialists have a thorough understanding of the energy industry and have played a major role in some of the most significant energy projects in Jordan. We provide legal support and prepare documentation under Jordanian jurisdiction, offering trusted advice regardless of the complexity or scale of the project.',

  services: [
    'Legal due diligence on energy projects',
    'Reviewing and analyzing legal frameworks',
    'Drafting and negotiating legal documents',
    'Reviewing Power Purchase Agreements',
    'Transmission Connection Agreements',
    'Government Guarantee Agreements',
    'Legal advisory for development, financing, construction, and operation on a BOO basis',
    'Studying, drafting, and reviewing shareholder agreements',
    'Lender reports and financial documents',
    'RFP preparation and review',
    'Oil, gas, and renewable energy projects',
    'Energy sector regulatory compliance',
  ],
}
,
  'telecommunications': {
  slug: 'telecommunications',
  title: 'Telecommunications, Technology & Media',
  icon: Radio,
  heroImage: '/HeroPractices.png',

  shortDescription:
    'Legal solutions for digital platforms, telecom operators, and content providers.',

  fullDescription:"We are very well positioned to advise clients on both regulatory and transactional aspects of this sector. The firm represents its client in major cross-border infrastructure projects, in addition to all IT related venture capital investments and joint venture transactions in the region. IBLAW has formerly advised the Telecommunications Regulatory Commission (TRC) on all aspects of licensing new Mobile and Fixed Phone Operators, and has assisted in drafting key amendments to the Telecommunications Law laying the groundwork for sector liberalization.",
  description2:"Our firm has acted for the Jordan Radio and Television Corporation since 2001 and has extensive experience in media sector support. This includes drafting sector-related production, distribution, licensing, marketing, broadcast, advertising and intellectual property agreements in addition to sector-related litigation.",
  services: [
    'Telecommunications Law and Regulations',
    'Media Law',
    'Telecommunications Contracts',
    'Telecommunications Finance',
    'Telecommunications Licensing',
    'Telecommunications Litigation',
  ],

  itSectorExperience: [
    'Participating in strategic planning sessions with Jordan’s IT industry',
    'Assessing conformity of Jordan’s legal regime with national IT strategy',
    'Conducting studies of legal barriers to investment in Information Technology',
    'Critical assessment of IT-related legislation',
    'Identifying regulatory impediments to IT industry development',
    'Advocacy and implementation of legal reforms',
    'Drafting new laws for IT industry development',
    'Preparing legal reports on regulatory framework, human resources, infrastructure, and government support',
    'E-commerce, e-payment, and e-government legislation',
    'Intellectual property protection for the IT sector',
    'Labor movement and industrial infrastructure for IT',
    'Company structure and capital requirements for technology firms',
  ],
}
,
  'financial-services': {
  slug: 'financial-services',
  title: 'Financial Services',
  icon: Landmark,
  heroImage: '/HeroPractices.png',

  shortDescription:
    'Legal advisory for banks, fintechs, and investment firms on transactions and regulation.',

  fullDescription:
    'Our team includes several attorneys with direct work experience as legal advisers to reputable local and international banks, including Japan Bank for International Cooperation (JIBC), Western Union, and Banco Santander. This practical experience, combined with our deep understanding of financial services regulation, positions us uniquely to serve financial institutions operating in Jordan.',

  description2:
    'We advise domestic and international banks and financial institutions on specialized and complex banking and financial transactions, including syndicated loans, project and structured finance, and secured debt. Our team also specializes in securities and capital markets, taxation, trade finance, documentary credit, and financial leasing.',

  services: [
    'Banking and Financial Institution Advisory',
    'Fintech Regulatory Compliance and Licensing',
    'Investment Firm Structuring and Operations',
    'Financial Product Development and Approval',
    'Payment Systems and Digital Banking',
    'Lending and Credit Facilities',
    'Securities and Capital Markets Transactions',
    'Financial Services Taxation',
    'Regulatory Compliance and Supervision',
    'Anti-Money Laundering and Compliance Programs',
    'Financial Institution Mergers and Acquisitions',
    'Cross-Border Financial Transactions',
  ],
}
,
  'government': {
  slug: 'government',
  title: 'Government & Public Sector',
  icon: Building2,
  heroImage: '/HeroPractices.png',

  shortDescription:
    'Partnering with public institutions on legislative drafting, procurement frameworks, and administrative reform.',

  fullDescription:
    'Our Public Policy and Legislative Drafting practice has a deep understanding of how the government operates and has fostered an extensive network including the Jordanian government, the private sector, and international agencies and donors.',

  description2:
    'IBLAW provides comprehensive legal advice and consulting services to government entities and public sector institutions in areas of public policy, legal reform, procurement frameworks, and administrative restructuring. We are active in identifying public policy reform requirements, drafting, advocating, and implementing legislation that serves the public interest while promoting economic development.',

  services: [
    'Legislative Drafting and Advocacy',
    'Public Procurement Framework Development',
    'Administrative Reform and Restructuring',
    'Governance and Rule of Law Initiatives',
    'Economic and Judicial Reform',
    'Public Sector Modernization',
    'Regulatory Framework Design',
    'Policy Analysis and Development',
    'Government Contracts and Agreements',
    'Public-Private Partnerships',
    'Institutional Capacity Building',
    'Compliance and Oversight Mechanisms',
  ],

  keyRelationships: [
    'Jordanian Government Ministries and Agencies',
    'USAID',
    'European Commission',
    'World Bank',
    'DFID',
    'United Nations Programs',
    'International Development Organizations',
  ],
}
,
'special-economic-zones': {
  slug: 'special-economic-zones',
  title: 'Special Economic Zones & Free Zones',
  icon: Globe,
  heroImage: '/HeroPractices.png',

  shortDescription:
    'Supporting clients operating in Special Economic Zones and Free Zones on setup, licensing, and compliance.',

  fullDescription:
    'The firm is credited with drafting the legislative package establishing and governing the Aqaba Special Economic Zone (ASEZ) in Jordan. This includes drafting and advocating for more than 30 pieces of legislation covering zone governance, customs, business licensing and regulation, land use and zoning, foreign investment, market access, and environmental regulation.',

  description2:
    'In addition to Jordan, IBLAW has advised on inland ports, duty free zones, and affiliated industrial parks, and has worked on major special economic zone projects in Saudi Arabia and the Gulf region.',

  aqabaSpecialEconomicZoneRole: [
    'Drafting the Zone’s constitutional bylaws and entire package of governing legislation',
    'Creating 20 regulations, nearly 70 instructions, and 17 memoranda of understanding (MOUs)',
    'Governing regulatory aspects including business licensing, customs, land, labor, and immigration',
    'Taxation, government procurement, zoning, and environmental protection frameworks',
    'Private sector participation in real estate and infrastructure development',
    'Risk-based systems for food control and health procedures',
    'Registration and permitting systems for economic activities',
    'Electronic enablement of business processes',
    'Origin rules and certification',
    'Online interactive systems for business registration and licensing',
  ],

  saudiArabiaMegaProjects: [
    'Drafting founding laws for special economic zones',
    'Examining legislative processes for laws, regulations, and legal instruments',
    'Analyzing issuance mechanisms and legal tools',
    'Monitoring regulatory environment challenges and gaps',
    'Benchmark analysis against international standards',
    'Designing rules and methods of legislative drafting',
    'Institutional building for zone governance',
    'Program development for continuous legislative improvement',
    'Independent judiciary frameworks for special zones',
  ],

  services: [
    'Zone Establishment and Legal Framework Design',
    'Business Licensing and Setup Procedures',
    'Regulatory Compliance Advisory',
    'Customs and Tax Optimization',
    'Investment Incentives and Benefits',
    'Land Use and Real Estate Development',
    'Labor and Immigration Matters',
    'Environmental Compliance',
    'Zone Governance Structures',
    'Public-Private Partnership Frameworks',
  ],
}
,
 'infrastructure': {
  slug: 'infrastructure',
  title: 'Infrastructure & Project Development',
  icon: Wrench,
  heroImage: '/HeroPractices.png',

  shortDescription:
    'Advising on procurement, financing, and execution of large-scale infrastructure projects.',

  fullDescription:
    'IBLAW has extensive experience with water, transportation, and energy and electricity privatization projects, including advising on BOT and BOO arrangements. The firm has played a major advisory role in the Kingdom’s privatization program across multiple utilities, sectors, and services.',

  description2:
    'Our team acts for both government entities and private sector bidders in structuring and implementing complex infrastructure transactions. We provide legal support throughout the project lifecycle, from feasibility and structuring through procurement, financing, construction, and operation.',

  majorProjectExperience: [
    'Aqaba Port relocation project (multimillion-dollar advisory)',
    'Queen Alia Airport expansion (BOT bid for international consortium)',
    'Amman Zarqa Light Railway (BOT bid advisory)',
    'Aqaba Railway privatization',
    'Water and wastewater sector frameworks (Amman and Aqaba)',
    'Aqaba Container Terminal',
    'Public transport companies',
    'Auxiliary aviation services',
    'National railway network establishment',
  ],

  services: [
    'Project Structuring and Feasibility',
    'Procurement Strategy and Tender Processes',
    'BOT, BOO, and PPP Arrangements',
    'Project Finance and Funding Structures',
    'Construction and EPC Contracts',
    'Operations and Maintenance Agreements',
    'Concession Agreements',
    'Government Guarantees and Support',
    'Regulatory Approvals and Licensing',
    'Risk Allocation and Mitigation',
    'Dispute Resolution Mechanisms',
    'Asset Transfer Arrangements',
  ],

  sectorFocus: [
    'Transportation (ports, airports, railways, roads)',
    'Energy and Power Generation',
    'Water and Wastewater Treatment',
    'Telecommunications Infrastructure',
    'Social Infrastructure (hospitals, schools)',
    'Real Estate and Urban Development',
  ],
},
}

