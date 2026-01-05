"use client";

import React, { useState } from "react";
import {
  LucideCalendarRange,
  LucideMenu,
  LucideX,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { quickLinks } from "@/lib/dataAndLinks";
import { Button } from "../ui/button";
import MainButton from "../ui/mainButton";
import PracticesSectorsDropdown from "../Practices/menu";
import SearchSection from "../Global/search";
import smoothScrollToElement from "../Global/ScrollSever";
// import LoginButton from "../ui/LoginLogoutButton";

function Navbar() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);



  return (
    <nav className="sticky top-10 bg-white border-b border-gray-200 z-50">
      <div className="sticky max-w-7xl mx-auto py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="w-12 h-12 flex items-center justify-center">
              <Image src="/logo.svg" alt="Logo" width={98} height={98} />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center">
            {quickLinks.map((link) => {
              const isPractices = link.href === "/practices";
              const isActive =
                    pathname === link.href ||
                    pathname.startsWith(`${link.href}/`)
              return (
                <div
                  key={link.name}
                  className="relative mx-4"
                  onMouseEnter={() => isPractices && setIsDropdownOpen(true)}
                  onMouseLeave={() => isPractices && setIsDropdownOpen(false)}
                >
                  {/* Link */}
                  <Link
                    href={link.href === "#contact" ? "/#contact" : link.href}
                    onClick={(e) => {
                      if (link.href === "#contact") {
                        e.preventDefault();
                        document.getElementById("contact")?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }
                    }}
                    className={`font-medium text-md transition-colors flex items-center gap-1 ${
                      isActive
                        ? "text-main"
                        : "text-ctext hover:text-main"
                    }`}
                  >
                    {/* Name + active dot */}
                    <span className="relative py-5 block">
                      {isActive ? (
                        <h1 className="font-bold">{link.name}</h1>
                      ) : (
                        link.name
                      )}

                      {isActive && (
                        <span className="absolute top-12 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-main animate-pulse" />
                      )}
                    </span>

                    {/* Arrow */}
                    {isPractices && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {isPractices && isDropdownOpen && (
                    <div className="absolute left-1/2 top-full -translate-x-1/2 z-9999 w-[1000px]">
                      <PracticesSectorsDropdown />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Search  */}
            <Button
              className="bg-transparent hover:bg-transparent"
              aria-label="Search"
              onClick={() => setSearch(!search)}
            >
              <Image
                src="/search.svg"
                alt="Search Icon"
                width={20}
                height={20}
              />
            </Button>

            {/* Search Modal */}
            {search && (
              <SearchSection isOpen={search} onClose={() => setSearch(false)} />
            )}

            <Link
              href="#contact?subject=schedule-meeting"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '?subject=schedule-meeting#contact');
                smoothScrollToElement("contact", 1000); // 1000ms = 1 second
              }}
              className=""
            >
              <MainButton
                text="Schedule A Meeting"
                left={LucideCalendarRange}
                className="h-10"
              />
            </Link>

            {/* Mobile Menu Button */}
            <Button
              onClick={() => setMenu(!menu)}
              variant="outline"
              aria-label="Toggle menu"
              className="lg:hidden bg-transparent w-10 h-10 shadow-none border-none hover:bg-transparent"
            >
              {menu ? <LucideX /> : <LucideMenu />}
            </Button>
            {/* <LoginButton/> */}
          </div>
        </div>
      </div>

      {/* Mobile Menu  */}
      {menu && (
        <div className="lg:hidden fixed right-0 top-0 w-full h-full  md:w-100 bg-white z-9999 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="px-6 py-8">
            <div className="space-y-2 mb-6 mt-20 ">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={
                      link.href === "#contact" ? "/#contact" : link.href
                    }
                    onClick={(e) => {
                      if (link.href === "#contact") {
                        e.preventDefault();
                        document.getElementById("contact")?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }
                      setMenu(false);
                    }}
                    className={`flex items-center gap-4 px-4 py-4 rounded-lg transition-all ${
                      pathname === link.href
                        ? "bg-main/10 text-main"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {Icon && (
                      <Icon className="w-6 h-6 text-main"/>
                    )}
                    <span className="text-lg font-medium">{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/*  Schedule A Meeting */}
            <div className="border-t border-gray-200 pt-6">
              <Link
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({
                    behavior: "smooth",
                  });
                  setMenu(false);
                }}
                className="block w-full"
              >
                <MainButton
                  text="Schedule A Meeting"
                  left={LucideCalendarRange}
                  className="w-full h-12"
                />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;