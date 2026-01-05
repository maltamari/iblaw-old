// components/Home/contactBar.tsx
import Image from 'next/image'

function MeetingSection() {
  return (
    <div className="relative w-full h-[400px] " id="contact">
      <Image
        src="/meetingroom2.jpg"
        alt="Meeting Room"
        width={1440}
        height={10}
        className='w-[1440px] h-[400px] object-cover'
      />
     <div className="absolute inset-0 bg-main/90"></div>
      <h1 className='absolute text-3xl lg:text-5xl top-[35%] md:left-35 md:right-35 text-center text-white font-bold '>
        Ready To Scale up Your Business With Us?
        <br />
       <span className="mt-3 inline-block">Contact us</span>

      </h1>
    </div>
  );
}

export default MeetingSection;
