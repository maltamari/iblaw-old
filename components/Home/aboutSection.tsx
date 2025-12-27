import {  ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import MainButton from '../ui/mainButton';
import Link from 'next/link';
import RightArrow from '../ui/rightArrow';

export default function AboutSection() {
  return (
    <section className="relative w-full py-16 md:py-34 bg-gray-50">
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
          <div className="space-y-6">
            {/* Small Title */}
            <p className="text-lg font-semibold text-gray-900 uppercase tracking-wider">
              ABOUT IBLAW
            </p>

            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-main leading-tight capitalize">
              A leading full service law firm
            </h2>

            {/* Description */}
            <p className="text-lg text-ctext leading-relaxed">
              IBLAW is a leading full-service law firm in the Hashemite Kingdom of Jordan dedicated to providing its clients with unparalleled legal services. Our lawyers consistently strive to deliver excellence in the most complex and demanding legal matters by overcoming and circumventing the legal challenges our clients face. Our lawyers consistently strive to deliver excellence under several industries and legal practices.
            </p>

            {/* Learn More Button */}
            <Link href={"/about"} className="pt-4 ">
             <MainButton text={"Learn More"} right={RightArrow}  className='w-full h-12 justify-start text-xl'/>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}