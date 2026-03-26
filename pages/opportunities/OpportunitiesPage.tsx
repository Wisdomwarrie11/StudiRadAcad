
import React from 'react';
// Fix: Use type-safe module import workaround for missing Link export
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { FaBriefcaseMedical, FaUserGraduate, FaLaptopMedical, FaStethoscope, FaBuilding } from 'react-icons/fa';
import { Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../../components/SEO';

const OpportunitiesPage = () => {
  const opportunityCards = [
    {
      title: "Job Opportunities",
      desc: "Find radiography-related job openings across healthcare facilities and imaging centers.",
      link: "/jobs",
      icon: FaBriefcaseMedical,
      color: "amber",
      theme: "from-amber-500 to-orange-600"
    },
    {
      title: "Internships",
      desc: "Gain clinical exposure and hands-on training that bridges theory with practice.",
      link: "/internship",
      icon: FaLaptopMedical,
      color: "indigo",
      theme: "from-indigo-500 to-blue-600"
    },
    {
      title: "Scholarships",
      desc: "Access funding and academic support designed for radiography students worldwide.",
      link: "/scholarship",
      icon: FaUserGraduate,
      color: "emerald",
      theme: "from-emerald-500 to-teal-600"
    },
    {
      title: "Locum Finder",
      desc: "Find qualified Locum Radiographers near you, or register yourself to get hired instantly.",
      link: "/locum",
      icon: FaStethoscope,
      color: "rose",
      theme: "from-rose-500 to-pink-600"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-200 text-slate-900 selection:bg-brand-primary/20 selection:text-slate-900 font-sans">
      <SEO 
        title="Career Opportunities"
        description="Find Radiography jobs, internships, locum shifts, and scholarships. Advance your career with StudiRad."
      />

      {/* Hero Section - Technical Split */}
      <section className="grid lg:grid-cols-2 min-h-[80vh] border-b border-slate-300">
        <div className="p-8 md:p-20 flex flex-col justify-center border-r border-slate-300 bg-slate-100/50 backdrop-blur-sm">
           <motion.div
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
           >
           
             <h1 className="text-4xl md:text-6xl font-serif italic font-light leading-tight mb-8">
               Career <br />
               <span className="font-sans font-black uppercase tracking-tighter text-brand-primary">Growth</span> <br />
               Pathways
             </h1>
             <p className="text-lg text-slate-600 max-w-md font-light leading-relaxed mb-10">
               The premier destination for radiography professionals. Discover clinical internships, global jobs, and scholarships.
             </p>
             <div className="flex flex-wrap gap-4">
               <a href="#opportunities" className="bg-slate-900 text-white px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-brand-primary transition-all shadow-lg">
                 Explore Now
               </a>
               <Link to="/employer/register" className="px-8 py-4 rounded-lg border border-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-slate-300 transition-all">
                 Post a Job
               </Link>
             </div>
           </motion.div>
        </div>
        
        <div className="p-8 md:p-20 bg-slate-200 flex flex-col justify-center relative overflow-hidden">
           {/* Decorative Grid Lines */}
           <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
           
           <div className="space-y-10 relative z-10">
              {[
                { label: "Verified Listings", desc: "Every opportunity is manually vetted for quality and authenticity.", icon: ShieldCheck },
                { label: "Global Reach", desc: "Connect with healthcare facilities across Nigeria and beyond.", icon: Sparkles },
                { label: "Career Support", desc: "Access resources and guidance to help you land your next role.", icon: FaUserGraduate }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="flex items-start gap-6 group"
                >
                  <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm border border-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                    <feature.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest mb-1">{feature.label}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>


      {/* Opportunity Types Grid - Technical Cards */}
      <section id="opportunities" className="py-24 px-4 border-b border-slate-300">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <h2 className="text-4xl md:text-6xl font-serif italic font-light tracking-tight leading-none">
              Explore <br /> <span className="font-sans font-black uppercase tracking-tighter text-brand-primary">Pathways</span>
            </h2>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-slate-400 block mb-1">Status: Online</span>
              <p className="text-slate-500 font-bold text-[10px] tracking-[0.2em] uppercase">
                Select a category to begin.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {opportunityCards.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-slate-50/80 backdrop-blur-md rounded-2xl p-10 border border-slate-300 shadow-sm hover:shadow-xl hover:border-slate-400 transition-all duration-500 flex flex-col justify-between min-h-[400px]"
              >
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.theme} rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <div>
                    <div className="flex justify-between items-start mb-8">
                      <div className={`w-16 h-16 bg-white text-slate-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-slate-200 shadow-sm`}>
                        <item.icon size={28} />
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Cat_0{idx + 1}</span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">{item.title}</h3>
                    <p className="text-base text-slate-500 mb-10 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                  
                  <Link 
                    to={item.link} 
                    className="inline-flex items-center justify-between w-full py-4 px-8 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold uppercase text-[9px] tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all duration-300 group"
                  >
                    Explore Category <ChevronRight className="transition-transform group-hover:translate-x-1" size={16} />
                  </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

            {/* Organization Portal - High Contrast */}
            <section className="grid lg:grid-cols-2 min-h-[60vh] border-b border-slate-300">
        <div className="p-8 md:p-20 bg-slate-900 text-white flex flex-col justify-center">
           <motion.div
             initial={{ opacity: 0, scale: 0.98 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="space-y-8"
           >
              <div className="w-16 h-16 bg-brand-primary text-white rounded-xl flex items-center justify-center shadow-2xl">
                <FaBuilding size={24} />
              </div>
              <h2 className="text-3xl md:text-5xl font-serif italic font-light leading-tight">
                Hiring for a <br /> <span className="font-sans font-black uppercase tracking-tighter">Hospital?</span>
              </h2>
              <p className="text-lg text-slate-400 font-light leading-relaxed max-w-md">
                Access the largest pool of qualified radiography talent in Nigeria. Post jobs, internships, and scholarships instantly.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/employer/register" className="bg-brand-primary text-white px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all">
                  Register Facility
                </Link>
                <Link to="/employer/login" className="px-8 py-4 rounded-lg border border-white/20 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all">
                  Employer Sign In
                </Link>
              </div>
           </motion.div>
        </div>
        
        <div className="p-8 md:p-20 flex flex-col justify-center space-y-10 bg-slate-100/30">
           <div className="grid gap-10">
              <div className="flex gap-6 group">
                 <div className="w-14 h-14 bg-white rounded-lg flex-shrink-0 flex items-center justify-center border border-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 shadow-sm">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <h4 className="text-base font-black uppercase tracking-widest mb-1">Targeted Reach</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Instantly connect with verified radiography professionals and students across the country.</p>
                 </div>
              </div>
              <div className="flex gap-6 group">
                 <div className="w-14 h-14 bg-white rounded-lg flex-shrink-0 flex items-center justify-center border border-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 shadow-sm">
                    <Sparkles size={24} />
                 </div>
                 <div>
                    <h4 className="text-base font-black uppercase tracking-widest mb-1">Simple Management</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Track applications and manage your listings through a dedicated, high-performance dashboard.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer Note - Technical Bar */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-slate-900 text-white p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-10 border border-white/10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff, #fff 1px, transparent 1px, transparent 10px)', backgroundSize: '14px 14px' }}></div>
             
             <div className="space-y-3 text-center md:text-left relative z-10">
                <h4 className="text-2xl font-serif italic font-light tracking-tight">Individual Radiographer?</h4>
                <p className="text-slate-400 font-medium text-sm max-w-md">Register your personal Locum profile to get discovered by hospitals instantly.</p>
             </div>
             <Link to="/locum/register" className="bg-white text-slate-900 px-10 py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl relative z-10">
                Register Profile
             </Link>
          </div>
        </div>
      </section>

    </main>
  );
};

export default OpportunitiesPage;
