import CareersPage from '@/components/careers/career'
import HeroSection from '@/components/Global/hero'
import React from 'react'

function page() {
  return (
    <>
        <HeroSection image={"/HeroCareers.png"}
          text={"Build Your Career With Us"}
          text2='Join a team of exceptional legal professionals'
          className={"h-100"}
          textClass='w-full px-10 text-center text-4xl'
          aboutClass="justify-center w-full"
          background="bg-main/80"
        />
        
        <CareersPage/>
    </>
  )
}

export default page