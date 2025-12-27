'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

function BarSection() {
  const [showEnglish, setShowEnglish] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ حل Hydration Error
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full">
      {/* Quote Section with Diagonal Design */}
      <div className="relative h-[70px] sm:h-[180px] md:h-[190px] lg:h-[229px]">
        
        {/* Diagonal Background */}
        <div className="absolute inset-0">
          
          {/* Light Gray Left Side */}
          <div className="absolute inset-0 bg-hover"></div>

          {/* Blue Diagonal Section */}
          <div
            className="absolute inset-0 bg-main flex items-center justify-center"
            style={{
              clipPath: 'polygon(100% 0, 100% 100%, 22% 100%, 10% 0)',
            }}
          >
            <div className="flex flex-row items-center justify-evenly w-[80%] ml-15 md:ml-45 lg:ml-80 gap-4">

              {/* Quote Text Container with Toggle */}
              <div 
                className="relative flex-1 cursor-pointer group"
                onClick={() => mounted && setShowEnglish(!showEnglish)}

              >
                {/* Arabic Quote */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    showEnglish ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                  } absolute inset-0`}
                >
                  <p
                    className="text-[7px] sm:text-sm md:text-xl lg:text-2xl font-light leading-relaxed text-white text-right sm:w-full"
                    dir="rtl"
                  >
                    «المجتمعاتُ تَسْمُو حينَ ترتقي بمفاهيمِ سيادةِ القانونِ والعدالةِ والمساواةِ
                    <br className="hidden sm:block" />
                    وتزرعه في ضميرِ الناسِ كقيمةٍ وعقيدة.»
                    <br />
                    <span className="text-[6px] sm:text-xs md:text-base lg:text-lg opacity-90 not-italic">
                      — د. صلاح الدين البشير
                    </span>
                  </p>
                </div>

                {/* English Translation */}
                <div
                  className={`transition-all duration-500 ease-in-out ml-5 ${
                    showEnglish ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                  }`}
                >
                  <p className="text-[7px] sm:text-sm md:text-xl lg:text-2xl italic font-light leading-relaxed text-white sm:w-full">
                    "Societies are exalted when they elevate the concepts of the rule of law,
                    <br className="hidden sm:block" />
                    justice, and equality, and implant them in the conscience of the people
                    <br className="hidden sm:block" />
                    as a value and a creed."
                    <br />
                    <span className="text-[6px] sm:text-xs md:text-base lg:text-lg opacity-90">
                      ~ Dr. Salaheddin Al-Bashir
                    </span>
                  </p>
                </div>

                {/* Hover Indicator */}
                {mounted && (
                  <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[6px] sm:text-xs text-white/60">
                      {showEnglish ? 'العربية ←' : 'English →'}
                    </span>
                  </div>
                )}
              </div>

              {/* Signature */}
              <div className="shrink-0">
                <Image
                  src="/signature.svg"
                  width={70}
                  height={60}
                  alt="Dr. Salaheddin signature"
                  className="w-4 sm:w-10 md:w-[45px] lg:w-[55px] lg:mr-20"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarSection;