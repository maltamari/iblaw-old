"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import RightArrow from "../ui/rightArrow";
import { unifiedPracticesAndSectors } from "@/lib/practicesAndSectorsPagesData";

const PracticesAndSectors = () => {
  const [activeTab, setActiveTab] = useState<"practices" | "sectors">(
    "practices"
  );

  const currentSections = unifiedPracticesAndSectors.filter(
    (item) =>
      activeTab === "practices"
        ? item.type === "practice"
        : item.type === "sector"
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-16 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex rounded-full bg-white p-5 shadow-lg">
            <Button
              onClick={() => setActiveTab("practices")}
              className={`px-10 py-7 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "practices"
                  ? "bg-main text-white shadow-md"
                  : "text-ctext hover:text-gray-900"
              }`}
            >
              Practices
            </Button>

            <Button
              onClick={() => setActiveTab("sectors")}
              className={`px-10 py-7 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "sectors"
                  ? "bg-main text-white shadow-md"
                  : "text-ctext hover:text-gray-900"
              }`}
            >
              Sectors
            </Button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 w-full">
          {currentSections.map((section, index) => (
            <Link key={section.slug} href={`/practices/${section.slug}`}>
              <div
                className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer animate-slide-up flex flex-col items-center text-center h-full min-h-[400px]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className="w-24 h-24 rounded-full bg-main flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-lg shrink-0">
                  <section.Icon className="w-10 h-10 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-main transition-colors duration-300 min-h-16 flex items-center">
                  {section.title}
                </h3>

                {/* Subtitle */}
                <h4 className="text-lg font-semibold text-main mb-4 min-h-10 flex items-center">
                  {section.description}
                </h4>

                {/* Details */}
                <p className="text-ctext leading-relaxed mb-6 grow">
                  {section.details}
                </p>

                {/* Button */}
                <Button
                  size="lg"
                  className="bg-main text-white px-10 py-4 rounded-full font-semibold inline-flex items-center gap-2 hover:bg-[#003c6a] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-blue-900/50 mt-auto shrink-0"
                >
                  Learn More
                  <RightArrow />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PracticesAndSectors;
