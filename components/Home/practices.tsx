// components/Home/practices.tsx
"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import MainButton from '../ui/mainButton';
import Link from 'next/link';
import { slides } from '@/lib/dataAndLinks';
import RightArrow from '../ui/rightArrow';
import { Button } from '../ui/button';

export default function PracticesSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <section className="relative w-full py-16 md:py-34 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section - Image and Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          
          {/* Left Side - Image */}
          <div className="">
            <div className="relative h-[200px] md:h-[300px] lg:h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/conferenceRoom.png"
                alt="Conference room"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-4">
            {/* Small Title */}
            <p className="text-lg font-semibold text-gray-900 uppercase tracking-wider mt-2">
              OUR EXPERTISE
            </p>

            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-4xl font-bold text-main leading-tight capitalize">
              Practices & Sectors
            </h2>

            {/* Description */}
            <div className="space-y-1 text-xl md:text-xl text-ctext leading-relaxed w-full text-justify">
              <p>
                The firm thrives on a culture of cooperation and shared contribution, ensuring that expertise and experience is shared across departments whenever required for the further benefit of its clients. Furthermore, the firm&apos;s ability to draw on its inter-department resources for addressing complex and multifaceted legal requirements gives its leverage efficiency in routine matters in the client&apos;s best interest.
              </p>
              <p>
                IBLAW provides solid experience in established areas of practice, with up to date knowledge of frontier legal developments in:
              </p>
            </div>
          </div>
        </div>

        {/* Practice Cards Section */}
        <div className="relative">
          
          {/* Practice Cards Grid - 4 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {slides[currentSlide].map((practice, index) => {
              // Title logic for "Corporate & Commercial"



              return (
                <div
                  key={index}
                  className=" bg-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="flex h-45 w-full flex-col items-start space-y-7">
                    
                    {/* Icon */}
                    <div className="shrink-0">
                      <practice.icon className="w-10 h-10 text-main" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-main mb-2 leading-tight">
                        {practice.title}
                      </h3>

                      <p className="text-ctext text-sm leading-relaxed">
                        {practice.description}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center space-x-3 mb-8">
            {slides.map((_, index) => (
              <Button
                size={"icon-sm"}
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-main' 
                    : 'bg-gray-300 hover:bg-hover'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center pt-4">
            <Link href={"/practices"}>
              <MainButton 
                text={"Check All Practices & Sectors"} 
                right={RightArrow} 
                className='w-full h-12 justify-start text-xl'
              />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}