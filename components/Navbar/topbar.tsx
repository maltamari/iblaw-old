import React from 'react'
import { Mail, Phone } from 'lucide-react'
import {  Linkedin } from 'lucide-react'
import Link from 'next/link'

function Topbar() {
  return (
    <div className="sticky top-0 z-50 bg-main text-white py-3 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left side - Contact info */}
          <div className="flex items-center space-x-6">
            <Link
              href="mailto:contact@iblaw.com.jo" 
              className="flex items-center space-x-2 hover:text-gray-200 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm">contact@iblaw.com.jo</span>
            </Link>
            <Link
              href="tel:+96265525127" 
              className="flex items-center space-x-2 hover:text-gray-200 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm">+962 6 552 5127</span>
            </Link>
          </div>

          {/* Right side - Social media icons */}

            <Link
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
        </div>
      </div>
    </div>
  )
}

export default Topbar