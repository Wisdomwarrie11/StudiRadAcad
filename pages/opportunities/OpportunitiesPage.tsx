import React from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcaseMedical, FaUserGraduate, FaLaptopMedical, FaArrowRight, FaStethoscope } from 'react-icons/fa';

const OpportunitiesPage = () => {
  return (
    <div className="min-h-screen bg-white py-24 mt-8">
      <div className="container mx-auto px-4 max-w-6xl text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
          Explore Opportunities with <span className="text-amber-500">Studi</span><span className="text-slate-800">Rad</span>
        </h1>
        <p className="text-xl text-slate-500 mb-16 max-w-2xl mx-auto">
          Discover pathways that help radiography students and professionals grow — 
          from internships and jobs to scholarship opportunities.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Job Opportunities */}
          <div className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-amber-200 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="w-20 h-20 mx-auto bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FaBriefcaseMedical size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Job Opportunities</h3>
            <p className="text-slate-600 mb-8 min-h-[3rem]">
              Find radiography-related job openings across healthcare facilities and imaging centers.
            </p>
            
            <Link 
              to="/jobs" 
              className="inline-flex items-center justify-center w-full py-3 px-4 bg-white border-2 border-slate-100 rounded-xl text-slate-700 font-bold hover:border-amber-400 hover:text-amber-600 transition-colors"
            >
              View Jobs <FaArrowRight className="ml-2 text-sm" />
            </Link>
          </div>

          {/* Internship Opportunities */}
          <div className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="w-20 h-20 mx-auto bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FaLaptopMedical size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Internships</h3>
            <p className="text-slate-600 mb-8 min-h-[3rem]">
              Gain clinical exposure and hands-on training that bridges theory with practice.
            </p>
            
            <Link 
              to="/internship" 
              className="inline-flex items-center justify-center w-full py-3 px-4 bg-white border-2 border-slate-100 rounded-xl text-slate-700 font-bold hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
              View Internships <FaArrowRight className="ml-2 text-sm" />
            </Link>
          </div>

          {/* Scholarship Opportunities */}
          <div className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-emerald-200 transition-all duration-300">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="w-20 h-20 mx-auto bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FaUserGraduate size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Scholarships</h3>
            <p className="text-slate-600 mb-8 min-h-[3rem]">
              Access funding and academic support designed for radiography students worldwide.
            </p>
            
            <Link 
              to="/scholarship" 
              className="inline-flex items-center justify-center w-full py-3 px-4 bg-white border-2 border-slate-100 rounded-xl text-slate-700 font-bold hover:border-emerald-400 hover:text-emerald-600 transition-colors"
            >
              View Scholarships <FaArrowRight className="ml-2 text-sm" />
            </Link>
          </div>

          {/* Locum Finder - New Card */}
          <div className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-rose-200 transition-all duration-300">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 to-pink-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="w-20 h-20 mx-auto bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FaStethoscope size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Locum Finder</h3>
            <p className="text-slate-600 mb-8 min-h-[3rem]">
               Find qualified Locum Radiographers near you, or register yourself to get hired instantly.
            </p>
            
            <Link 
              to="/locum" 
              className="inline-flex items-center justify-center w-full py-3 px-4 bg-white border-2 border-slate-100 rounded-xl text-slate-700 font-bold hover:border-rose-400 hover:text-rose-600 transition-colors"
            >
              Find Locums <FaArrowRight className="ml-2 text-sm" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OpportunitiesPage;