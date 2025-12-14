import { practicesData } from '@/lib/practicesPagesData'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import CheckIcon from '../ui/checkIcon'

interface Props {
  slug: string
}

function PracticesDetails({ slug }: Props) {
  const practices = practicesData[slug]
  
  if (!practices) {
    return <div>Practice not found</div>
  }
  
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header Section */}
      <div className="bg-linear-to-br from-main to-main text-white py-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col justify-center items-center">
          {/* Back Button */}
          <Link href={"/practices"}>
            <Button className="flex items-center gap-2 bg-[#195889] hover:bg-[#4c7da3] px-6 py-3 rounded-full mb-12 transition-all duration-300 hover:-translate-x-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Practices</span>
            </Button>
          </Link>
          
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="bg-white text-main rounded-full p-8 shadow-lg">
              <practices.icon className="w-12 h-12" />
            </div>
          </div>
          
          {/* Title and Tagline */}
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">{practices.title}</h1>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto">
              {practices.shortDescription}
            </p>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Full Description */}
        <div className="bg-transparent p-8">
          <p className="text-ctext text-lg py-10 leading-relaxed border-b border-gray-200">
            {practices.fullDescription}
          </p>
        </div>
        
        {/* Description 2 */}
        {practices.description2 && (
          <div className="bg-transparent p-8 mb-8">
            <p className="text-ctext text-lg leading-relaxed">
              {practices.description2}
            </p>
          </div>
        )}

        {/* Description 3 */}
        {practices.description3 && (
          <div className="bg-transparent p-8 mb-8 border-b border-gray-200">
            <p className="text-ctext text-lg leading-relaxed">
              {practices.description3}
            </p>
          </div>
        )}
        
        {/* Services Section */}
        {practices.services && practices.services.length > 0 && (
          <div className="bg-transparent rounded-lg p-8 mb-8">
            <h2 className="text-4xl font-bold text-main mb-8 py-3">
              Our Services
            </h2>
            <ul className="space-y-4">
              {practices.services.map((service, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                        <CheckIcon className='bg-transparent w-5 h-5 text-main' />
                  </div>
                  <span className="text-gray-700 text-lg">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Advisory Services */}
        {practices.advisoryServices && practices.advisoryServices.length > 0 && (
          <div className="bg-transparent rounded-lg p-8 mb-8">
            <h2 className="text-4xl font-bold text-main mb-8 py-3">
              Legal Advisory and Consultancy
            </h2>
            <ul className="space-y-4">
              {practices.advisoryServices.map((service, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                        <CheckIcon className='bg-transparent w-5 h-5 text-main' />
                  </div>
                  <span className="text-gray-700 text-lg">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* IP Agreements */}
        {practices.ipAgreements && practices.ipAgreements.length > 0 && (
          <div className="bg-transparent rounded-lg p-8 mb-8">
            <h2 className="text-4xl font-bold text-main mb-8 py-3">
              Drafting and Reviewing IP Agreements
            </h2>
            <ul className="space-y-4">
              {practices.ipAgreements.map((agreement, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                        <CheckIcon className='bg-transparent w-5 h-5 text-main' />
                  </div>
                  <span className="text-gray-700 text-lg">{agreement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Litigation and Prosecution */}
        {practices.litigationAndProsecution && practices.litigationAndProsecution.length > 0 && (
          <div className="bg-transparent rounded-lg p-8 mb-8">
            <h2 className="text-4xl font-bold text-main mb-8 py-3">
              Litigation & Prosecution
            </h2>
            <ul className="space-y-4">
              {practices.litigationAndProsecution.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                        <CheckIcon className='bg-transparent w-5 h-5 text-main' />
                  </div>
                  <span className="text-gray-700 text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Additional Services */}
        {practices.additionalServices && practices.additionalServices.length > 0 && (
          <div className="bg-transparent rounded-lg p-8 mb-8">
            <h2 className="text-4xl font-bold text-main mb-8 py-3">
              Additional Services
            </h2>
            <ul className="space-y-4">
              {practices.additionalServices.map((service, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                        <CheckIcon className='bg-transparent w-5 h-5 text-main' />
                  </div>
                  <span className="text-gray-700 text-lg">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* IT Sector Experience */}
        {practices.itSectorExperience && practices.itSectorExperience.length > 0 && (
          <div className="bg-transparent rounded-lg p-8 mb-8">
            <h2 className="text-4xl font-bold text-main mb-8 py-3">
              IT Sector Experience
            </h2>
            <ul className="space-y-4">
              {practices.itSectorExperience.map((exp, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                        <CheckIcon className='bg-transparent w-5 h-5 text-main' />
                  </div>
                  <span className="text-gray-700 text-lg">{exp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Core Services */}
        {practices.coreServices && practices.coreServices.length > 0 && (
          <div className="bg-transparent rounded-lg p-8 mb-8">
            <h2 className="text-4xl font-bold text-main mb-8 py-3">
              Our Services
            </h2>
            <ul className="space-y-4">
              {practices.coreServices.map((service, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                        <CheckIcon className='bg-transparent w-5 h-5 text-main' />
                  </div>
                  <span className="text-gray-700 text-lg">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Energy and Electricity */}
        {practices.energyAndElectricity && practices.energyAndElectricity.length > 0 && (
          <div className="bg-transparent rounded-lg p-8 mb-8">
            <h2 className="text-4xl font-bold text-main mb-8 py-3">
              Energy and Electricity
            </h2>
            <ul className="space-y-4">
              {practices.energyAndElectricity.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                        <CheckIcon className='bg-transparent w-5 h-5 text-main' />
                  </div>
                  <span className="text-gray-700 text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Transportation */}
        {practices.transportation && practices.transportation.length > 0 && (
          <div className="bg-transparent rounded-lg p-8 mb-8">
            <h2 className="text-4xl font-bold text-main mb-8 py-3">
              Transportation
            </h2>
            <ul className="space-y-4">
              {practices.transportation.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                        <CheckIcon className='bg-transparent w-5 h-5 text-main' />
                  </div>
                  <span className="text-gray-700 text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Water and Utilities */}
        {practices.waterAndUtilities && practices.waterAndUtilities.length > 0 && (
          <div className="bg-transparent rounded-lg p-8 mb-8">
            <h2 className="text-4xl font-bold text-main mb-8 py-3">
              Water
            </h2>
            <ul className="space-y-4">
              {practices.waterAndUtilities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                        <CheckIcon className='bg-transparent w-5 h-5 text-main' />
                  </div>
                  <span className="text-gray-700 text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Relationships */}
        {practices.keyRelationships && practices.keyRelationships.length > 0 && (
          <div className="bg-transparent rounded-lg p-8 mb-8">
            <h2 className="text-4xl font-bold text-main mb-8 py-3">
              Key Relationships
            </h2>
            <ul className="space-y-4">
              {practices.keyRelationships.map((rel, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                        <CheckIcon className='bg-transparent w-5 h-5 text-main' />
                  </div>
                  <span className="text-gray-700 text-lg">{rel}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Major Project Experience */}
        {practices.majorProjectExperience && practices.majorProjectExperience.length > 0 && (
          <div className="bg-transparent rounded-lg p-8 mb-8">
            <h2 className="text-4xl font-bold text-main mb-8 py-3">
              Major Project Experience
            </h2>
            <ul className="space-y-4">
              {practices.majorProjectExperience.map((proj, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                        <CheckIcon className='bg-transparent w-5 h-5 text-main' />
                  </div>
                  <span className="text-gray-700 text-lg">{proj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sector Focus */}
        {practices.sectorFocus && practices.sectorFocus.length > 0 && (
          <div className="bg-transparent rounded-lg p-8 mb-8">
            <h2 className="text-4xl font-bold text-main mb-8 py-3">
              Sector Focus
            </h2>
            <ul className="space-y-4">
              {practices.sectorFocus.map((sector, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                        <CheckIcon className='bg-transparent w-5 h-5 text-main' />
                  </div>
                  <span className="text-gray-700 text-lg">{sector}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Aqaba Special Economic Zone Role */}
        {practices.aqabaSpecialEconomicZoneRole && practices.aqabaSpecialEconomicZoneRole.length > 0 && (
          <div className="bg-transparent rounded-lg p-8 mb-8">
            <h2 className="text-4xl font-bold text-main mb-8 py-3">
              Aqaba Special Economic Zone (ASEZ) - Our Role
            </h2>
            <ul className="space-y-4">
              {practices.aqabaSpecialEconomicZoneRole.map((role, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                        <CheckIcon className='bg-transparent w-5 h-5 text-main' />
                  </div>
                  <span className="text-gray-700 text-lg">{role}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Saudi Arabia Mega Projects */}
        {practices.saudiArabiaMegaProjects && practices.saudiArabiaMegaProjects.length > 0 && (
          <div className="bg-transparent rounded-lg p-8 mb-8">
            <h2 className="text-4xl font-bold text-main mb-8 py-3">
              Saudi Arabia Mega Projects
            </h2>
            <ul className="space-y-4">
              {practices.saudiArabiaMegaProjects.map((proj, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                        <CheckIcon className='bg-transparent w-5 h-5 text-main' />
                  </div>
                  <span className="text-gray-700 text-lg">{proj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Accomplishments */}
        {practices.accomplishments && (
          <div className="bg-transparent rounded-lg p-8 mb-8">
            
            {practices.accomplishments.jordan && practices.accomplishments.jordan.length > 0 && (
              <div className="mb-8">
                <h3 className="text-4xl font-bold text-main mb-8 py-3">Major Accomplishments - Jordan</h3>
                <ul className="space-y-4">
                  {practices.accomplishments.jordan.map((acc, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="shrink-0 mt-1">
                        <CheckIcon className='bg-transparent w-5 h-5 text-main' />
                      </div>
                      <span className="text-gray-700 text-lg">{acc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {practices.accomplishments.regional && practices.accomplishments.regional.length > 0 && (
              <div className="mb-8">
                <h3 className="text-4xl font-bold text-main mb-8 py-3">Regional Experience</h3>
                <ul className="space-y-4">
                  {practices.accomplishments.regional.map((acc, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="shrink-0 mt-1">
                        <CheckIcon className='bg-transparent w-5 h-5 text-main' />
                      </div>
                      <span className="text-gray-700 text-lg">{acc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {practices.accomplishments.saudiArabiaAndGulf && practices.accomplishments.saudiArabiaAndGulf.length > 0 && (
              <div>
                <h3 className="text-4xl font-bold text-main mb-8 py-3">Saudi Arabia and Gulf</h3>
                <ul className="space-y-4">
                  {practices.accomplishments.saudiArabiaAndGulf.map((acc, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="shrink-0 mt-1">
                        <CheckIcon className='bg-transparent w-5 h-5 text-main' />
                      </div>
                      <span className="text-gray-700 text-lg">{acc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PracticesDetails