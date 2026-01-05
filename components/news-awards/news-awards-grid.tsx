"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type NewsAward = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image_url: string;
};

interface Props {
  newsAwards: NewsAward[];
}

export default function NewsAwardsGrid({ newsAwards }: Props) {
  const [filter, setFilter] = useState<"all" | "News" | "Award">("all");

  const filtered =
    filter === "all"
      ? newsAwards
      : newsAwards.filter((item) => item.category === filter);

  return (
    <section className="py-16 md:py-24 bg-gray-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <Button
            onClick={() => setFilter("all")}
            variant={filter === "all" ? "default" : "outline"}
            className={
              filter === "all"
                ? "bg-main hover:bg-main/90"
                : "hover:bg-gray-100"
            }
          >
            All
          </Button>
          <Button
            onClick={() => setFilter("News")}
            variant={filter === "News" ? "default" : "outline"}
            className={
              filter === "News"
                ? "bg-main hover:bg-main/90"
                : "hover:bg-gray-100"
            }
          >
            News
          </Button>
          <Button
            onClick={() => setFilter("Award")}
            variant={filter === "Award" ? "default" : "outline"}
            className={
              filter === "Award"
                ? "bg-main hover:bg-main/90"
                : "hover:bg-gray-100"
            }
          >
            Awards
          </Button>
        </div>

        {/* Articles Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No {filter === "all" ? "" : filter.toLowerCase()} items found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={article.image_url}
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
                    <span className="text-sm font-medium text-gray-400">
                      {new Date(article.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-main transition-colors duration-300">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-ctext leading-relaxed">{article.excerpt}</p>

                  {/* Read More Link */}
                  <div className="pt-2">
                    <Link
                      href="#"
                      className="text-gray-900 font-semibold hover:text-main transition-colors duration-300 inline-flex items-center group"
                    >
                      Read More
                      <span className="ml-1 group-hover:ml-2 transition-all duration-300">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}