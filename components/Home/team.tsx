import React from 'react';
import { ArrowLeftIcon, ArrowRight, ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import MainButton from '../ui/mainButton';
import Link from 'next/link';
import LeftArrow from '../ui/leftArrow';

export default function TeamSection() {
  return (
    <section className="relative  py-16 md:py-54 w-[80%] ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Image */}
          <div className="lg:-mt-50">
            <div className="relative h-[200px] md:h-[300px] lg:h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/consultation.png"
                alt="Legal consultation meeting"
                fill
                className="object-center"          
                />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6 ">
            {/* Small Title */}
            <p className="text-lg font-semibold text-main uppercase tracking-wider">
              OUR TEAM
            </p>

            {/* Description */}
            <p className="text-5xl text-black font-bold ">
                We Have years of experience working with businesses of all sizes
            </p>

            {/* Learn More Button */}
            <Link href={"/team"} className="pt-4 ">
             <MainButton text={"Team Bios"} left={LeftArrow}  className='w-full h-12 justify-start text-xl'/>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}