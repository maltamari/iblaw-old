import { Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import MainButton from '../ui/mainButton';
import RightArrow from '../ui/rightArrow';

export default async function NewsAwardsSection() {
  const supabase = await createClient();

  // اجلب بس Awards
  const { data: articles } = await supabase
    .from('news_awards')
    .select('*')
    .eq('published', true)
    .eq('category', 'Award') // فلتر على Awards بس
    .order('date', { ascending: false })
    .limit(3);
    
  const displayArticles = articles || [];
      
  return (
    <section className="py-16 md:py-24 bg-gray-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-main">
            Awards
          </h2>
        </div>

        {displayArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No awards available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayArticles.map((article) => (
              <div 
                key={article.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={article.image_url}
                    alt={article.title}
                    fill
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  <div className="absolute top-6 left-6">
                    <span className="bg-white text-main px-6 py-2 rounded-md font-semibold text-sm shadow-md">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <div className="flex items-center space-x-2 text-main">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-medium text-gray-400">
                      {new Date(article.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-main transition-colors duration-300">
                    {article.title}
                  </h3>

                  <p className="text-ctext leading-relaxed">
                    {article.excerpt}
                  </p>

                  <div className="pt-2">
                    <Link
                     href={article.url || "#"} 
                      target="_blank"
                      rel="noopener noreferrer"
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
        )}

        {displayArticles.length > 0 && (
          <div className="flex justify-center mt-12 ">
            <Link href="/news-awards">
              <MainButton 
                text="View All Awards" 
                right={RightArrow} 
                className="w-[300px] h-12 justify-center text-lg "
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}