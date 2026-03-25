import { unifiedPracticesAndSectors } from "@/lib/practicesAndSectorsPagesData";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PracticesSectorsDropdownProps {
  className?: string;
}

const PracticesSectorsDropdown = ({
  className,
}: PracticesSectorsDropdownProps) => {
  const practices = unifiedPracticesAndSectors.filter(
    (item) => item.type === "practice"
  );

  const sectors = unifiedPracticesAndSectors.filter(
    (item) => item.type === "sector"
  );

  return (
    <div
      className={cn(
        "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-2xl shadow-2xl p-4",
        className
      )}
    >
      {/* Practices Section */}
      <div className="mb-5">
        <h3 className="text-xl font-bold text-main mb-3 pb-1 border-b-2 border-main">
          Practices
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {practices.map((practice) => (
            <Link
              key={practice.slug}
              href={`/practices/${practice.slug}`}
              className="flex items-center gap-3 p-1 rounded-lg hover:bg-blue-50 transition-all duration-300 group"
            >
              <practice.Icon className="w-5 h-5 text-main shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-gray-700 group-hover:text-main text-sm font-medium transition-colors">
                {practice.title}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Sectors Section */}
      <div>
        <h3 className="text-xl font-bold text-main mb-3 pb-1 border-b-2 border-main">
          Sectors
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sectors.map((sector) => (
            <Link
              key={sector.slug}
              href={`/practices/${sector.slug}`}
              className="flex items-center gap-3 p-1 rounded-lg hover:bg-blue-50 transition-all duration-300 group"
            >
              <sector.Icon className="w-5 h-5 text-main shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-ctext group-hover:text-main text-sm font-medium transition-colors">
                {sector.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PracticesSectorsDropdown;
