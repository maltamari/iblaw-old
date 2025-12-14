"use client"
import React, { useState } from 'react';
import { Award, Building2, Scale, Lightbulb, Home, Users, Globe, Shield, Handshake, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import MainButton from '../ui/mainButton';
import Link from 'next/link';
import { slides } from '@/lib/dataAndLinks';
import RightArrow from '../ui/rightArrow';
import { Button } from '../ui/button';

export default function PracticesSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Left - Title */}
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-main">
              Practices & Sectors
            </h2>
          </div>

          {/* Right - Description */}
          <div className="space-y-6 text-ctext leading-relaxed">
            <p>
              The firm thrives on a culture of cooperation and shared contribution, ensuring that expertise and experience is shared across departments whenever required for the further benefit of its clients. Furthermore, the firm's ability to draw on its inter-department resources for addressing complex and multifaceted legal requirements gives its leverage efficiency in routine matters in the client's best interest.
            </p>
            <p>
              IBLAW provides solid experience in established areas of practice, with up to date knowledge of frontier legal developments in:
            </p>
          </div>
        </div>

        {/* Carousel Section */}
        <div className="relative ">
          
          {/* Conference Room Image + Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2  items-center  mb-12">
            
            {/* Left - Conference Room Image */}
            <div className="relative lg:w-[300px] max-sm:ml-5 h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/conferenceRoom.png"
                alt="Conference room"
                fill
                className=" object-cover "
              />
              <div className="inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Right - Practice Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:absolute max-sm:mt-10 left-70">
            {slides[currentSlide].map((practice, index) => {

                // -------- Title logic فقط لأول عنصر --------
                let titleContent: React.ReactNode = practice.title;

                if (practice.title === "Corporate & Commercial") {
                const words = practice.title.split(" ");
                const lastWord = words.pop();
                const firstPart = words.join(" ");

                titleContent = (
                    <>
                    {firstPart} <span className="block">{lastWord}</span>
                    </>
                )

                }

                return (
                <div
                    key={index}
                    className="bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                    <div className="flex flex-col py-15 items-start space-x-4">
                    
                    {/* Icon */}
                    <div className="shrink-0">
                        <practice.icon className="w-10 h-10 text-main -mt-15" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-main mb-2 leading-tight">
                        {titleContent}
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
                    ? 'bg-main ' 
                    : 'bg-gray-300 hover:bg-hover'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* CTA Button */}
        <Link href={"/practices"} className="flex justify-center">
            <MainButton text={"Check All Practices & Sectors"} right={RightArrow}  className='w-[300px]  h-12 justify-start text-lg' />
        </Link>
        </div>

      </div>

    </section>
  );
}