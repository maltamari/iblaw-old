"use client"
import { useState } from 'react';
import { Star, Briefcase, SendHorizonalIcon } from 'lucide-react';
import WhyJoin from './whyJoin';
import Current from './opportunities';
import Apply from './apply';
import { Button } from '../ui/button';

const CareersPage = () => {
  const [activeTab, setActiveTab] = useState('why-join');
  const [preSelectedPosition, setPreSelectedPosition] = useState<string | null>(null);

  const tabs = [
    { id: 'why-join', label: 'Why Join IBLAW', icon: Star },
    { id: 'opportunities', label: 'Current Opportunities', icon: Briefcase },
    { id: 'apply', label: 'Apply Now', icon: SendHorizonalIcon }
  ];

  const handleApplyClick = (position: string) => {
    setPreSelectedPosition(position);
    setActiveTab('apply');
    
    // Smooth scroll to top
    setTimeout(() => {
      window.scrollTo({ top:600 , behavior: 'smooth' });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 w-full">
      {/* Tab Navigation */}
      <nav 
        role="tablist"
        className="bg-white border-b border-gray-200 top-0 z-40 shadow-sm"
        aria-label="Career sections"
      >
        <div className="max-w-7xl mx-auto py-14">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== 'apply') {
                    setPreSelectedPosition(null);
                  }
                }}
                className={`flex items-center w-70 py-7 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-main text-white shadow-lg scale-105'
                    : 'bg-white text-ctext border-2 border-gray-200 hover:border-main hover:text-main'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <WhyJoin activeTab={activeTab} />
        <Current activeTab={activeTab} onApplyClick={handleApplyClick} />
        <Apply activeTab={activeTab} preSelectedPosition={preSelectedPosition} />
      </main>
    </div>
  );
};

export default CareersPage;