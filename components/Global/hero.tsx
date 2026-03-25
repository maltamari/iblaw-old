import { cn } from '@/lib/utils';
import Image from 'next/image';


interface PropsHero{
    text:string,
    image:string,
    className?:string,
    textClass?:string,
    aboutClass?:string
    text2?:string
    background?:string
}

export default function HeroSection({text,image,className,textClass,aboutClass,text2,background}:PropsHero) {
  return (
    <div className="relative w-full ">
      {/* Hero Image Section */}
        <div className={cn("relative w-full h-[605px]",className)}>
        <Image
            src={image}
            alt="Law office background"
            fill    
            className="object-cover "
            priority

        />
        
        {/* Dark Overlay */}
        <div className={cn("absolute inset-0 bg-black/40 ",background)}></div>
        
        {/* Hero Text */}
        <div className={cn("relative  z-10 flex items-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16  ",aboutClass)}>
          <div className="max-w-5xl ">
            <h1 className={cn("text-3xl md:text-4xl lg:text-5xl  text-white leading-tight  ",textClass)}>
              {text}
            </h1>
            <h3 className='text-white text-center py-5 max-sm:px-5 text-xl'>{text2}</h3>
          </div>
        </div>
      </div>

     
    </div>
  );
}