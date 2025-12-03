import React from 'react';
import { UserPlus, Search, PlayCircle, Award } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your free account in seconds to access your personalized dashboard."
  },
  {
    icon: Search,
    title: "Choose a Class",
    description: "Explore video courses and live virtual classes tailored to radiography modalities."
  },
  {
    icon: PlayCircle,
    title: "Start Learning",
    description: "Join live classes or study at your own pace with high-quality recorded sessions."
  },
  {
    icon: Award,
    title: "Get Certified",
    description: "Earn recognized certificates to boost your CV and advance your career."
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-base font-bold text-brand-primary uppercase tracking-wider mb-2">Process</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">How the Academy Works</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your journey to mastery is just four simple steps away.
          </p>
        </div>
        
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center group">
                  <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:bg-brand-accent group-hover:border-brand-accent">
                    <Icon className="text-brand-primary group-hover:text-brand-dark transition-colors" size={32} />
                  </div>
                  <div className="bg-white p-4 rounded-xl">
                    <h3 className="text-xl font-bold text-brand-dark mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;