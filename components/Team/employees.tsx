"use client"
import React, { useState } from 'react';
import { associates, partners, management, trainees } from '@/lib/dataAndLinks';
import { Button } from '../ui/button';
import Link from 'next/link';



 function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();

  const first = parts[0][0];
  const last = parts[1][0];

  return (first + last).toUpperCase();
}


const Employees = () => {
  const [activeTab, setActiveTab] = useState<'partners' |'associates' | 'management'|'trainees'>('partners');

const sectionsMap = {partners,associates,management,trainees,};


const currentSections = sectionsMap[activeTab];

 return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-16 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center px-4 flex justify-center items-center mb-12 animate-fade-in ">

          {/* Tab Switcher */}
          <div className="w-full px-4 lg:px-8 lg:w-170 items-center rounded-3xl lg:rounded-full bg-white p-5 shadow-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => setActiveTab('partners')}
              className={`px-10 hover:bg-gray-100 py-7 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'partners'
                  ? 'bg-main text-white shadow-lg shadow-blue-200 hover:bg-main'
                  : 'text-ctext hover:text-gray-900'
              }`}
            >
              Partners
            </Button>
            <Button
              onClick={() => setActiveTab('associates')}
              className={`px-10 hover:bg-gray-100 py-7 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'associates'
                  ? 'bg-main text-white shadow-lg shadow-blue-200 hover:bg-main'
                  : 'text-ctext hover:text-gray-900'
              }`}
            >
              Associates
            </Button>
            <Button
              onClick={() => setActiveTab('management')}
              className={`px-10 hover:bg-gray-100 py-7 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'management'
                  ? 'bg-main text-white shadow-lg shadow-blue-200 hover:bg-main'
                  : 'text-ctext hover:text-gray-900 '
              }`}
            >
              Management
            </Button>
            <Button
              onClick={() => setActiveTab('trainees')}
              className={`px-10 hover:bg-gray-100 py-7 rounded-full  font-semibold transition-all duration-300 ${
                activeTab === 'trainees'
                  ? 'bg-main text-white shadow-lg shadow-blue-200 hover:bg-main'
                  : 'text-ctext hover:text-gray-900'
              }`}
            >
              Trainees
            </Button>
          </div>
        </div>

        {/* Cards Grid */}
        <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 w-full px-4 lg:px-8">
          {currentSections.map((section, index) => (
            <Link key={section.name} href={"/"} >
            <div
              className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer animate-slide-up flex flex-col items-center text-center h-full min-h-[400px]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon Circle */}
              <div className="w-24 h-24 rounded-full bg-main flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-lg shrink-0">
                <div className="text-white font-bold text-2xl">
                  {getInitials(section.name)}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-main transition-colors duration-300 min-h-16 flex items-center">
                {section.name}
              </h3>

              {/* Subtitle */}
              <h4 className="text-lg font-semibold text-main mb-4 min-h-10 flex items-center">
                {section.role}
              </h4>

              {/* Details */}
              <p className="text-ctext leading-relaxed mb-6 grow">
                {section.department}
              </p>


            </div>
            </Link>
          ))}
        </div>

      </div>

 
    </div>
  );
};

export default Employees;