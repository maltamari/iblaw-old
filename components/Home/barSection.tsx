'use client';

import Image from 'next/image';
import { useState } from 'react';

function BarSection() {
  const [showArabic, setShowArabic] = useState(true);

  return (
    <div 
      className="w-full cursor-pointer" 
      onClick={() => setShowArabic(!showArabic)}
    >
      {/* Quote Section with Diagonal Design */}
      <div className="relative h-[140px] sm:h-[180px] md:h-[200px] lg:h-[229px]">
        
        {/* Diagonal Background */}
        <div className="absolute inset-0">
          
          {/* Light Gray Left Side */}
          <div className="absolute inset-0 bg-hover"></div>

          {/* Blue Diagonal Section */}
          <div
            className="absolute inset-0 bg-main"
            style={{
              clipPath: 'polygon(100% 0, 100% 100%, 20% 100%, 10% 0)',
            }}
          ></div>
        </div>

        {/* Content Container */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-row items-center justify-end h-full gap-2 sm:gap-4 ${!showArabic ? 'flex-row-reverse' : ''}`}>

            {/* Quote Text Container with Toggle */}
            <div className="relative flex-1 cursor-pointer group transition-all duration-500 ease-out">
              
              {/* Arabic Quote */}
              <div
                className={`transition-all duration-700 ease-in-out ${
                  showArabic ? 'opacity-0' : 'opacity-100'
                } absolute inset-0`}
              >
                <p
                  className="text-sm md:text-lg mt-4 md:mt-0 lg:text-2xl font-light leading-relaxed text-white text-right"
                  dir="rtl"
                >
                  <span className="text-white/80">«</span>
                  تَسْمُو المجتمعاتُ حينَ ترتقي بمفاهيمِ
                  {' '}سيادةِ القانونِ والعدالةِ والمساواةِ
                  وتزرعه في ضميرِ الناسِ كقيمةٍ وعقيدة.
                  <span className="text-white/80">»</span>
                  <br />
                  <span className="sm:text-xs md:text-sm lg:text-lg opacity-90 not-italic block mt-1 sm:mt-2">
                    — د. صلاح الدين البشير
                  </span>
                </p>
              </div>

              {/* English Translation */}
              <div
                className={`transition-all duration-700 ease-in-out ${
                  showArabic ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                }`}
              >
                <p className="text-[12px]  ml-27 md:ml-40 md:-mt-5 2xl:ml-0 sm:text-sm md:text-lg lg:text-2xl italic font-light leading-relaxed text-white">
                  <span className="text-white/80">&quot;</span>
                  Societies are exalted when they elevate the concepts of the rule of law, justice, and equality, and implant them in the conscience of the people as a value and a creed.
                  <span className="text-white/80">&quot;</span>
                  <br />
                  <span className="text-[10px] sm:text-xs md:text-sm lg:text-lg opacity-90 block mt-1 sm:mt-2">
                    ~ Dr. Salaheddin Al-Bashir
                  </span>
                </p>
              </div>
            </div>

            {/* Signature */}
            <div className="shrink-0">
              <Image
                src="/signature.svg"
                width={70}
                height={60}
                alt="Dr. Salaheddin signature"
                className={`w-10 sm:mt-10 ml-10 sm:w-10 md:w-[45px] lg:w-[55px] ${showArabic ? '' : 'ml-20 sm:ml-40 2xl:ml-0'} transition-all duration-700 ease-in-out`}
                priority
              />
            </div>

            {/* Toggle Indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-60 group-hover:opacity-100 transition-all duration-500 ease-out">
              <div className="flex items-center text-white/80">
                <span className="text-[8px] sm:text-xs transition-all duration-300 ease-initial">
                  {showArabic ? 'English' : 'العربية'}
                </span>
                <svg 
                  className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ease-initial ${!showArabic ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarSection;