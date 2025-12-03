import React from 'react';
import { BookOpen, MonitorPlay, Users, Briefcase, Search, ShieldCheck } from 'lucide-react';
import { Feature } from '../../types';

const features: Feature[] = [
  {
    title: "Comprehensive Resources",
    description: "Access a wide range of expertly curated materials tailored to radiography students, covering fundamental to advanced topics.",
    icon: BookOpen
  },
  {
    title: "Interactive Learning",
    description: "Experience a dynamic learning environment with quizzes, case studies, and real-world scenarios to enhance understanding.",
    icon: MonitorPlay
  },
  {
    title: "Community & Mentorship",
    description: "Join a network of radiography students and professionals for discussions, guidance, and one-on-one mentorship opportunities.",
    icon: Users
  },
  {
    title: "Access to Opportunities",
    description: "Exclusive access to internships, research collaborations, and job placements to advance your radiography career.",
    icon: Briefcase
  }
];

const Features: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-bold text-brand-primary uppercase tracking-wider mb-2">Why StudiRad?</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Elevating Radiography Standards</h3>
          <p className="text-gray-600 text-lg">
            We provide a holistic ecosystem for your professional growth, bridging the gap between academic theory and clinical excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group p-8 rounded-2xl bg-brand-light hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-accent/20 transition-colors">
                  <Icon className="text-brand-primary group-hover:text-brand-accent transition-colors" size={32} />
                </div>
                <h4 className="text-xl font-bold text-brand-dark mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Search Bar / Browse Teaser */}
        <div className="mt-16 bg-brand-dark rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-brand-primary rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-brand-accent rounded-full opacity-20 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2 text-brand-accent font-medium">
                <ShieldCheck size={20} />
                <span>Certified Content</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Looking for something specific?</h3>
              <p className="text-gray-300">Browse over 500+ verified resources tailored for you.</p>
            </div>
            <div className="w-full md:w-auto flex-1 max-w-lg">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search for courses, jobs, or articles..." 
                  className="w-full py-4 pl-12 pr-4 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-brand-primary/50 shadow-lg"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;