import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../../components/SEO';
import ResearchWorkSection from '../../services/ResearchWorkSection';
import PrivateClassesSection from '../../services/PrivateClassessection';
import { FileText, Video, ArrowDown } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    let targetId = '';

    if (hash.includes('#research')) {
      targetId = 'research';
    } else if (hash.includes('#private-classes')) {
      targetId = 'private-classes';
    }

    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Services"
        description="StudiRad Radiography services: Research Work support and Private Classes."
      />

      {/* Hero Header in Oxford Blue */}
      <section className="bg-[#033c51] text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b border-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#f59e0b] text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
            StudiRad Services
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white max-w-2xl mx-auto">
            Radiography Services
          </h1>

          <p className="mt-3 text-blue-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Professional academic assistance for your research projects and upcoming private classes for radiography students.
          </p>

          {/* Quick Jump Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 max-w-2xl mx-auto text-left">
            {/* Research Work Card */}
            <button
              onClick={() => scrollToSection('research')}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <FileText size={18} />
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active
                  </span>
                </div>
                <h3 className="font-bold text-white text-base">
                  Research Work
                </h3>
                <p className="text-xs text-blue-100 mt-1">
                  Assistance with topics, project editing, and statistical data analysis.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#f59e0b]">
                <span>Go to form</span>
                <ArrowDown size={13} className="group-hover:translate-y-0.5 transition-transform" />
              </div>
            </button>

            {/* Private Classes Card */}
            <button
              onClick={() => scrollToSection('private-classes')}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <Video size={18} />
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Coming Soon
                  </span>
                </div>
                <h3 className="font-bold text-white text-base">
                  Private Classes
                </h3>
                <p className="text-xs text-blue-100 mt-1">
                  1-on-1 personal tutoring tailored to your syllabus. Vote to introduce.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#f59e0b]">
                <span>Vote to introduce</span>
                <ArrowDown size={13} className="group-hover:translate-y-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* 1. Research Work Section */}
      <ResearchWorkSection />

      {/* 2. Private Classes Section */}
      <PrivateClassesSection />
    </div>
  );
};

export default ServicesPage;
