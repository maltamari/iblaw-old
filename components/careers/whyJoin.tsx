import { whyJoinReasons } from '@/lib/careerData';

interface WhyJoinProps {
  activeTab: string;
}

const WhyJoin = ({ activeTab }: WhyJoinProps) => {
  if (activeTab !== 'why-join') return null;

  return (
    <div className="animate-fade-in">
      <h1 className="text-5xl font-bold text-main text-center mb-4">
        Why Join IBLAW?
      </h1>
      <div className="w-20 h-1 bg-main  mb-12 max-w-7xl mx-auto "></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
        {whyJoinReasons.map((reason, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-slide-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="w-20 h-20 rounded-full bg-main flex items-center justify-center mb-6 shadow-lg">
              <reason.icon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {reason.title}
            </h3>
            <p className="text-ctext leading-relaxed">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyJoin;