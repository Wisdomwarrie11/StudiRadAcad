import React from 'react';
import { MapPin, Briefcase, GraduationCap, Building2, ChevronRight } from 'lucide-react';
import { Opportunity } from '../../types';
import { Link, useLocation } from 'react-router-dom';


const opportunities: Opportunity[] = [
  {
    id: "1",
    title: "Senior CT Radiographer",
    organization: "St. Mary's General Hospital",
    type: "Job",
    location: "Lagos, Nigeria",
    datePosted: "2 days ago"
  },
  {
    id: "2",
    title: "Radiography Research Fellow",
    organization: "HealthTech Innovations",
    type: "Research",
    location: "Remote",
    datePosted: "5 days ago"
  },
  {
    id: "3",
    title: "One-Year radiography Internship",
    organization: "University of Uyo Teaching Hospital (UNIUYO)",
    type: "Internship",
    location: "Uyo, Nigeria",
    datePosted: "1 week ago"
  },
  {
    id: "4",
    title: "Canada Scholarship for Msc Students",
    organization: "Canada University",
    type: "Scholarship",
    location: "Global",
    datePosted: "Just now"
  }
];

const getBadgeColor = (type: string) => {
  switch (type) {
    case 'Job': return 'bg-blue-100 text-blue-700';
    case 'Internship': return 'bg-green-100 text-green-700';
    case 'Scholarship': return 'bg-purple-100 text-purple-700';
    case 'Research': return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const OpportunitiesPreview: React.FC = () => {
  return (
    <section id="opportunities" className="py-20 bg-brand-dark text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary rounded-full filter blur-[100px] opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent rounded-full filter blur-[80px] opacity-10"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-brand-accent font-bold uppercase tracking-wider mb-2">Career Hub</h2>
            <h3 className="text-3xl md:text-4xl font-bold">Latest Opportunities</h3>
          </div>
        
           <a href="#/opportunities">  <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl backdrop-blur-sm transition-all flex items-center gap-2">
            Browse All <ChevronRight size={18} />
          </button></a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {opportunities.map((opp) => (
            <div key={opp.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(opp.type)}`}>
                  {opp.type}
                </span>
                <span className="text-gray-400 text-xs">{opp.datePosted}</span>
              </div>
              
              <h4 className="text-lg font-bold mb-2 line-clamp-2">{opp.title}</h4>
              
              <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                <Building2 size={16} className="text-brand-accent" />
                <span>{opp.organization}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                <MapPin size={16} />
                <span>{opp.location}</span>
              </div>

              <button className="w-full py-2 rounded-lg border border-white/20 text-sm font-semibold hover:bg-brand-accent hover:text-brand-dark hover:border-brand-accent transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpportunitiesPreview;