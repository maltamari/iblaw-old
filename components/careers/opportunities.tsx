'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Briefcase, MapPin, Clock, SendHorizonalIcon, ArrowRightIcon } from 'lucide-react';
import { getJobListings, JobListing } from '@/utils/job-listing-actions';
import CheckIcon from '../ui/checkIcon';
import MainButton from '../ui/mainButton';
import { Button } from '../ui/button';

interface CurrentProps {
  activeTab: string;
  onApplyClick: (position: string) => void;
}

// Loading Skeleton Component
const JobSkeleton = () => (
  <div className="space-y-6">
    {[1, 2].map(i => (
      <div key={i} className="bg-white rounded-3xl p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    ))}
  </div>
);

const Current = ({ activeTab, onApplyClick }: CurrentProps) => {
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data, error } = await getJobListings();
      
      if (error) {
        setError(error);
      } else {
        setJobListings(data || []);
      }
      setLoading(false);
    };

    if (activeTab === 'opportunities') {
      fetchJobs();
    }
  }, [activeTab]);

  // Use useMemo for performance
  const displayedJobs = useMemo(() => jobListings, [jobListings]);

  if (activeTab !== 'opportunities') return null;

  if (loading) {
    return <JobSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>Error loading job listings: {error}</p>
      </div>
    );
  }

  if (!displayedJobs || displayedJobs.length === 0) {
    return (
      <div className="text-center text-ctext p-8">
        <p className="text-xl">No current opportunities available at the moment.</p>
        <p className="mt-2">Please check back later for new openings.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" role="tabpanel" id="panel-opportunities">
      <h1 className="text-5xl font-bold text-main text-center mb-4">
        Current Opportunities
      </h1>
      <div className="w-20 h-1 bg-main mx-auto mb-6"></div>
      
      <p className="text-center text-ctext text-lg mb-12 max-w-4xl mx-auto">
        Explore our current openings and find the position that best suits your qualifications. Each role at IBLAW is an opportunity to work on meaningful legal matters while advancing your career.
      </p>

      <div className="space-y-6">
        {displayedJobs.map((job, index) => (
          <div
            key={job.id}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {job.title}
                </h2>
                <div className="flex items-center gap-6 text-ctext flex-wrap">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-main" />
                    <span>{job.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-main" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-main" />
                    <span>{job.type}</span>
                  </div>
                </div>
              </div>
              <Button className="w-15 h-15 hover:scale-110 rounded-full bg-main flex items-center justify-center hover:bg-[#003c6a] transition-all">
              <ArrowRightIcon  className=" text-white scale-170" strokeWidth={2.5} />
            </Button>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-main mb-3">
                About the Role
              </h3>
              <p className="text-ctext leading-relaxed">
                {job.description}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-main mb-4">
                Requirements
              </h3>
              <ul className="space-y-3">
                {job.requirements.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-ctext">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

              <MainButton 
              aria-label={`Apply for ${job.title}`}
              onClick={() => onApplyClick(job.title)}
              text='Apply for this Position' 
              right={SendHorizonalIcon} 
              className='px-10 py-2 mt-10' 
              spanClass='font-bold'
            />


          </div>
        ))}
      </div>
    </div>
  );
};

export default Current;