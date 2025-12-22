'use client';

import { sections } from '@/lib/careerData';
import CheckIcon from '../ui/checkIcon';

interface LifeProps {
  activeTab: string;
}

const Life = ({ activeTab }: LifeProps) => {
  if (activeTab !== 'life') return null;

  return (
    <div className="animate-fade-in space-y-8" role="tabpanel" id="panel-life">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-main mb-4">Life at IBLAW</h1>
        <div className="w-20 h-1 bg-main mx-auto"></div>
      </div>

      {sections.map((section, index) => {
        const Icon = section.icon;
        
        return (
          <div key={index} className="bg-white rounded-2xl p-10 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <Icon className="w-7 h-7 text-main" />
              <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
            </div>
            
            {section.description && section.description.map((paragraph, pIndex) => (
              <p 
                key={pIndex} 
                className={`text-lg text-gray-700 leading-relaxed ${
                  pIndex < section.description!.length - 1 || section.items ? 'mb-5' : ''
                }`}
              >
                {paragraph}
              </p>
            ))}

            {section.items && (
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-3">
                    <CheckIcon />
                    <p className="text-lg text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Life;