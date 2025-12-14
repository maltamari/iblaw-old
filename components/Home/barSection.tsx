import Image from 'next/image'
import React from 'react'

function BarSection() {
  return (
    <div className="w-full ">
      {/* Quote Section with Diagonal Design */}
      <div className="relative h-[70px] sm:h-[180px] md:h-[190px] lg:h-[229px] ">
        
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
                 

            <div className="flex flex-row items-center justify-evenly w-[90%] ml-15 md:ml-45 lg:ml-80">

              {/* Quote Text */}

                <p
                  className="
                    text-[8px]
                    sm:text-base
                    md:text-2xl
                    lg:text-3xl
                    italic font-light leading-relaxed
                    text-white
                    sm:w-full
             

                  "
                >
                  " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do<br/> eiusmod tempor incididunt ut labore et dolore magna aliqua "
                  <br />
                  ~ Dr. Salah
                </p>
              <div className=" ">
                <Image
                  src="/signature.svg"
                  width={70}
                  height={60}
                  alt="signature"
                  className="
                    w-4
                    sm:w-10
                    md:w-[45px]
                    lg:w-[55px]
                    lg:mr-20
                  "
                  priority
                />
              </div>
              </div>

            </div>
          </div>

        </div>

        {/* Quote Content */}

    </div>

  )
}

export default BarSection
