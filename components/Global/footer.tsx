import { footerLinks, siteLinks } from "@/lib/dataAndLinks";
import { MapPin, Mail, Phone, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {


  return (
    <footer className="bg-linear-to-br from-main to-main text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/">
            <Image
              src="/footerLogo.svg"
              alt="IBLAW Logo"
              className="h-16 w-auto"
              width={30}
              height={30}
            />
            </Link>
            <p className="text-blue-100 leading-relaxed">
              IBLAW is a leading full service law firm in Jordan dedicated to
              working with clients to help them achieve their personal and
              professional goals and overcome legal challenges.
            </p>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 bg-[#165d93] hover:bg-[#2670a9] rounded-lg 
                hover:-translate-y-1 transition-transform duration-300"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3 ">
              {footerLinks.map((link) => (
                <li key={link.name} className="group transition-transform hover:translate-x-1 text-blue-300 hover:text-white">
                  <Link
                    href={link.href}
                    className="  inline-flex items-center"
                  >
                    <span className="mr-2  ">
                      ›
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Site Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 ">Site Links</h3>
            <ul className="space-y-3">
              {siteLinks.map((link) => (
                <li key={link.name} className="group hover:translate-x-1 transition-transform text-blue-300 hover:text-white">
                  <Link
                    href={link.href}
                    className=" transition-colors inline-flex items-center "
                  >
                    <span className="mr-2 ">
                      ›
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-300 shrink-0 mt-1" />
                <span className="text-blue-100">
                  P O Box 9028 Amman 11191 Jordan
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-300 shrink-0 mt-1" />
                <Link
                  href="mailto:contact@iblaw.com.jo"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  contact@iblaw.com.jo
                </Link>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-300 shrink-0 mt-1" />
                <Link
                  href="tel:+96265525127"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  +962 6 552 5127
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-blue-200 text-sm">
            Copyright © 2025 International Business Legal Associates. All rights
            reserved
          </p>
        </div>
      </div>
    </footer>
  );
}