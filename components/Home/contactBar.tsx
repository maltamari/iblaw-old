// components/Home/contactBar.tsx
import Image from 'next/image'

function MeetingSection() {
  return (
    <div className="relative w-full h-[400px] " id="contact">
      <Image
        src="/meetingroom2.jpg"
        alt="Meeting Room"
        width={1440}
        height={400}
        className='w-full h-[400px] object-cover'
      />
      <div className="absolute inset-0 bg-main/90"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className='text-3xl lg:text-5xl text-center text-white font-bold px-4'>
          Contact us
        </h1>
      </div>
    </div>
  );
}

export default MeetingSection;