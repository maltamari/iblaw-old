"use client"
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { getTeamMembers, TeamMember } from '@/utils/team-actions';
import Image from 'next/image';

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();

  const first = parts[0][0];
  const last = parts[1][0];

  return (first + last).toUpperCase();
}

const Employees = () => {
  const [activeTab, setActiveTab] = useState<'partners' | 'associates' | 'management' | 'trainees'>('partners');
  const [teamData, setTeamData] = useState<{
    partners: TeamMember[];
    associates: TeamMember[];
    management: TeamMember[];
    trainees: TeamMember[];
  }>({
    partners: [],
    associates: [],
    management: [],
    trainees: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeamMembers() {
      setLoading(true);
      const { data, error } = await getTeamMembers();
      
      if (data && !error) {
        // تقسيم البيانات حسب الفئة وترتيبها أبجدياً تلقائياً
        const grouped = {
          partners: data
            .filter(m => m.category === 'partner')
            .sort((a, b) => a.name.localeCompare(b.name)),
          associates: data
            .filter(m => m.category === 'associate')
            .sort((a, b) => a.name.localeCompare(b.name)),
          management: data
            .filter(m => m.category === 'management')
            .sort((a, b) => a.name.localeCompare(b.name)),
          trainees: data
            .filter(m => m.category === 'trainee')
            .sort((a, b) => a.name.localeCompare(b.name))
        };
        setTeamData(grouped);
      }
      setLoading(false);
    }

    fetchTeamMembers();
  }, []);

  const currentSections = teamData[activeTab];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-16 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center px-4 flex justify-center items-center mb-12 animate-fade-in">
          {/* Tab Switcher */}
          <div className="w-full px-4 lg:px-8 lg:w-170 items-center rounded-3xl lg:rounded-full bg-white p-5 shadow-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => setActiveTab('partners')}
              className={`px-10 hover:bg-gray-100 py-7 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'partners'
                  ? 'bg-main text-white shadow-lg shadow-blue-200 hover:bg-main'
                  : 'text-ctext hover:text-gray-900'
              }`}
            >
              Partners
            </Button>
            <Button
              onClick={() => setActiveTab('associates')}
              className={`px-10 hover:bg-gray-100 py-7 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'associates'
                  ? 'bg-main text-white shadow-lg shadow-blue-200 hover:bg-main'
                  : 'text-ctext hover:text-gray-900'
              }`}
            >
              Associates
            </Button>
            <Button
              onClick={() => setActiveTab('management')}
              className={`px-10 hover:bg-gray-100 py-7 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'management'
                  ? 'bg-main text-white shadow-lg shadow-blue-200 hover:bg-main'
                  : 'text-ctext hover:text-gray-900'
              }`}
            >
              Management
            </Button>
            <Button
              onClick={() => setActiveTab('trainees')}
              className={`px-10 hover:bg-gray-100 py-7 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'trainees'
                  ? 'bg-main text-white shadow-lg shadow-blue-200 hover:bg-main'
                  : 'text-ctext hover:text-gray-900'
              }`}
            >
              Trainees
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 w-full px-4 lg:px-8">
            {currentSections.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-ctext text-lg">No team members found in this category</p>
              </div>
            ) : (
              currentSections.map((section, index) => {
                // Generate slug if not exists
                const memberSlug = section.slug || section.name.toLowerCase().replace(/\s+/g, '-');
                
                return (
                  <Link key={section.id} href={`/team/${memberSlug}`}>
                    <div
                      className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer animate-slide-up flex flex-col items-center text-center h-full min-h-[400px]"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Icon Circle - لون موحد main */}
                      <div className={`w-35 h-35 rounded-full bg-main flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-lg shrink-0`}>
                      {section.photo_url ? (
                       <Image
                         src={section.photo_url}
                         alt={section.name}
                         width={192}
                         height={192}
                        className="w-full h-full rounded-full object-cover"
                        unoptimized 
                        />
                         ) : (
                         <div className="text-white font-bold text-4xl ">
                          {getInitials(section.name)}
                        </div>
    )}
                      </div>

                      {/* Title */}
                      <h3 className={`text-2xl font-bold mb-4 text-ctext transition-colors duration-300 min-h-16 flex items-center`}>
                        {section.name}
                      </h3>

                      {/* Subtitle */}
                      <h4 className="text-lg font-semibold text-main mb-4 min-h-10 flex items-center">
                        {section.role}
                      </h4>

                      {/* Details */}
                      <p className="text-ctext leading-relaxed mb-6 grow">
                        {section.department}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;