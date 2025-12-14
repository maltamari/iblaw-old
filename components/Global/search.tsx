"use client"
import React, { useState } from 'react';
import { Search, X, FileText, Briefcase, Bookmark, Users, GraduationCap } from 'lucide-react';
import { allSearchResults } from '@/lib/searchData';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface SearchSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Handle ESC key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const filteredResults = searchQuery.trim() 
    ? allSearchResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'file':
        return <FileText className="w-5 h-5" />;
      case 'briefcase':
        return <Briefcase className="w-5 h-5" />;
      case 'bookmark':
        return <Bookmark className="w-5 h-5" />;
      case 'users':
        return <Users className="w-5 h-5" />;
      case 'graduation':
        return <GraduationCap className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PAGE':
        return 'bg-blue-100 text-blue-700';
      case 'PRACTICE':
        return 'bg-orange-100 text-orange-700';
      case 'SECTOR':
        return 'bg-purple-100 text-purple-700';
      case 'TEAM':
        return 'bg-green-100 text-green-700';
      case 'CAREER':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleResultClick = (href: string) => {
    window.location.href = href;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 w-full bg-linear-to-br from-main via-main/90 to-main bg-opacity-95 flex items-start justify-center p-4 pt-20 z-9999 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Search className="w-6 h-6 text-gray-600" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages, practices, sectors, team members..."
              className="flex-1 text-lg outline-none text-gray-900 placeholder:text-gray-400"
              autoFocus
            />
            <Button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[500px] overflow-y-auto">
          {searchQuery.trim() ? (
            <div className="p-6">
              <p className="text-sm font-semibold text-gray-700 mb-4">
                {filteredResults.length} RESULTS FOUND
              </p>

              <div className="space-y-2">
                {filteredResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result.href)}
                    className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                      {getIcon(result.icon)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {result.title}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeColor(result.type)}`}>
                          {result.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {result.description}
                      </p>
                    </div>

                    <div className="text-gray-400 group-hover:text-gray-900 transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              {filteredResults.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No results found</p>
                  <p className="text-gray-400 text-sm mt-2">Try searching for something else</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                <Search className="w-12 h-12 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Search IBLAW
              </h2>
              <p className="text-gray-600 text-base mb-4">
                Find pages, practice areas, sectors, team members, and career opportunities
              </p>
              
              {/* Quick Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
                <span>{allSearchResults.filter(r => r.type === 'PRACTICE').length} Practices</span>
                <span>•</span>
                <span>{allSearchResults.filter(r => r.type === 'SECTOR').length} Sectors</span>
                <span>•</span>
                <span>{allSearchResults.filter(r => r.type === 'TEAM').length}+ Team Members</span>
              </div>
              
              {/* Keyboard shortcuts */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <kbd className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded text-xs font-semibold">
                    ESC
                  </kbd>
                  <span>to close</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <kbd className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded text-xs font-semibold">
                    ↵
                  </kbd>
                  <span>to navigate</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;