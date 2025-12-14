"use client"
import { useState } from 'react';
import { Star, Users, Briefcase, ArrowRight, SendHorizonalIcon } from 'lucide-react';
import WhyJoin from './whyJoin';
import Life from './life';
import Current from './current';
import Apply from './apply';
import { Button } from '../ui/button';

const CareersPage = () => {
  const [activeTab, setActiveTab] = useState('why-join');

  const tabs = [
    { id: 'why-join', label: 'Why Join IBLAW', icon: Star },
    { id: 'life', label: 'Life at IBLAW', icon: Users },
    { id: 'opportunities', label: 'Current Opportunities', icon: Briefcase },
    { id: 'apply', label: 'Apply Now', icon: SendHorizonalIcon }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 w-full">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200  top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto  py-14">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <WhyJoin activeTab={activeTab} />
        <Life activeTab={activeTab} />
        <Current activeTab={activeTab} />
        <Apply activeTab={activeTab} />
      </div>

    </div>
  );
};

export default CareersPage;