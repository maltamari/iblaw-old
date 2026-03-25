// components/Home/team.tsx
import Image from 'next/image';
import MainButton from '../ui/mainButton';
import Link from 'next/link';
import RightArrow from '../ui/rightArrow';

export default function TeamSection() {
  return (
    <section className="relative w-full py-16 md:py-34 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Image */}
          <div className="">
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
          <div className="space-y-4">
            {/* Small Title */}
            <p className="text-lg font-semibold text-gray-900 uppercase tracking-wider mt-2">
              OUR TEAM
            </p>

            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-4xl font-bold text-main leading-tight capitalize">
              We Have years of experience working with businesses of all sizes
            </h2>

            {/* Description (Optional - you can add one) */}
            <p className="text-xl md:text-xl text-ctext leading-relaxed w-full text-justify">
              Our team of experienced attorneys brings diverse expertise and a commitment to excellence in every case. We pride ourselves on delivering personalized legal solutions tailored to meet your unique needs.
            </p>

            {/* Learn More Button */}
            <Link href={"/team"} className="pt-4">
              <MainButton text={"learn more"} right={RightArrow} className='w-full h-12 justify-start text-xl' />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}