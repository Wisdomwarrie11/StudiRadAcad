
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcaseMedical, FaUserGraduate, FaLaptopMedical, FaArrowRight, FaStethoscope, FaBuilding } from 'react-icons/fa';
import { Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import SEO from '../../components/SEO';

const OpportunitiesPage = () => {
  const opportunityCards = [
    {
      title: "Job Opportunities",
      desc: "Find radiography-related job openings across healthcare facilities and imaging centers.",
      link: "/jobs",
      icon: FaBriefcaseMedical,
      color: "amber",
      theme: "from-amber-400 to-orange-500"
    },
    {
      title: "Internships",
      desc: "Gain clinical exposure and hands-on training that bridges theory with practice.",
      link: "/internship",
      icon: FaLaptopMedical,
      color: "indigo",
      theme: "from-indigo-400 to-blue-500"
    },
    {
      title: "Scholarships",
      desc: "Access funding and academic support designed for radiography students worldwide.",
      link: "/scholarship",
      icon: FaUserGraduate,
      color: "emerald",
      theme: "from-emerald-400 to-teal-500"
    },
    {
      title: "Locum Finder",
      desc: "Find qualified Locum Radiographers near you, or register yourself to get hired instantly.",
      link: "/locum",
      icon: FaStethoscope,
      color: "rose",
      theme: "from-rose-400 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-24 mt-8">
      <SEO 
        title="Career Opportunities"
        description="Find Radiography jobs, internships, locum shifts, and scholarships. Advance your career with StudiRad."
      />
      
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Career <span className="text-brand-primary">Growth Hub</span>
            </h1>
            <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-light">
            Discover pathways to advance your radiography career — from clinical internships to global job opportunities.
            </p>
        </div>

  

        {/* Opportunity Types Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {opportunityCards.map((item, idx) => (
            <div key={idx} className="group relative bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-slate-200 transition-all duration-500">
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${item.theme} rounded-t-[3rem] opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                
                <div className={`w-20 h-20 bg-${item.color}-50 text-${item.color}-500 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <item.icon size={32} />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-500 mb-10 min-h-[3rem] leading-relaxed font-medium">
                {item.desc}
                </p>
                
                <Link 
                to={item.link} 
                className="inline-flex items-center justify-center w-full py-4 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-black hover:bg-slate-900 hover:text-white transition-all group"
                >
                Explore {item.title} <ChevronRight className="ml-2 transition-transform group-hover:translate-x-1" size={18} />
                </Link>
            </div>
          ))}
        </div>

            {/* Employer/Hospital Portal CTA Section */}
            <div className="mb-20 bg-brand-dark rounded-[3.5rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden border border-white/5">
           {/* Decorative Background Elements */}
           <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>

           <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-brand-accent rounded-full text-xs font-black uppercase tracking-widest border border-white/5">
                    <FaBuilding size={14} /> Organization Portal
                 </div>
                 <h2 className="text-3xl md:text-4xl font-black leading-tight">Hiring for a Hospital or Imaging Center?</h2>
                 <p className="text-slate-400 text-lg leading-relaxed">
                    Register your facility today to post jobs, internships, and scholarships directly to our community of verified radiography professionals and students.
                 </p>
                 <div className="flex flex-wrap gap-4 pt-4">
                    <Link 
                      to="/employer/register" 
                      className="bg-brand-accent text-brand-dark px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-brand-accent/20"
                    >
                        Register Facility (Free)
                    </Link>
                    <Link 
                      to="/employer/login" 
                      className="px-8 py-4 rounded-2xl border border-white/20 font-black text-sm hover:bg-white/5 transition-all"
                    >
                        Employer Sign In
                    </Link>
                 </div>
              </div>
              
              <div className="hidden lg:grid grid-cols-2 gap-4">
                 <div className="bg-white/5 p-8 rounded-3xl border border-white/5 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                    <ShieldCheck className="text-brand-accent mb-4" size={32} />
                    <h4 className="font-bold text-lg mb-1">Targeted Reach</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Reach the largest pool of qualified radiography talent in Nigeria instantly.</p>
                 </div>
                 <div className="bg-white/5 p-8 rounded-3xl border border-white/5 backdrop-blur-sm mt-8 group hover:bg-white/10 transition-colors">
                    <Sparkles className="text-brand-accent mb-4" size={32} />
                    <h4 className="font-bold text-lg mb-1">Simple Management</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Track applications and manage your listings through a dedicated facility dashboard.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer Note */}
        <div className="bg-slate-900 text-slate-400 p-8 rounded-[2.5rem] text-center text-sm font-medium border border-white/5">
           <p>Are you an individual Radiographer? <Link to="/locum/register" className="text-brand-accent font-black hover:underline">Register your personal Locum profile</Link> to get discovered by hospitals.</p>
        </div>

      </div>
    </div>
  );
};

export default OpportunitiesPage;
