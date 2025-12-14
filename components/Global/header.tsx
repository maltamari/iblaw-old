import { cn } from '@/lib/utils'
import React from 'react'

interface Prpos{
  text:string,
  className?:string
}
function Header({text}:Prpos) {
  return (
    <div className="mb-12 mt-10 w-full">
      <p className={cn("px-10 text-gray-600 max-w-8xl mx-auto mb-8 leading-relaxed text-center")}>
        {text}
      </p>
    </div>
  )
}

export default Header
