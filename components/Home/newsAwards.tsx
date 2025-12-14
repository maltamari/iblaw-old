import React from 'react';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { articles } from '@/lib/dataAndLinks';

export default function NewsAwardsSection() {

  return (
    <section className="py-16 md:py-24 bg-gray-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-main">
            News and Awards
          </h2>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <div 
              key={index}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Category Badge */}
                <div className="absolute top-6 left-6">
                  <span className="bg-white text-main px-6 py-2 rounded-md font-semibold text-sm shadow-md">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-4">
                {/* Date */}
                <div className="flex items-center space-x-2 text-main">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-medium text-gray-400">{article.date}</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-main transition-colors duration-300">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-ctext leading-relaxed">
                  {article.excerpt}
                </p>

                {/* Read More Link */}
                <div className="pt-2">
                  <Link
                    href="#" 
                    className="text-gray-900 font-semibold hover:text-main transition-colors duration-300 inline-flex items-center group"
                  >
                    Read More
                    <span className="ml-1 group-hover:ml-2 transition-all duration-300">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}