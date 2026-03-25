import { cn } from '@/lib/utils'
import React from 'react'

interface Prpos{
  text:string,
  className?:string
}
function Header({text}:Prpos) {
  return (
    <div className="mb-12 mt-10 w-full">
      <p className={cn(" text-gray-600 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 leading-relaxed text-justify")}>
        {text}
      </p>
    </div>
  )
}

export default Header
