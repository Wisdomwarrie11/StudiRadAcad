
import React from 'react';
import { FaGraduationCap, FaGlobe, FaArrowLeft, FaMoneyBillWave } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const scholarships = [
  {
    id: 1,
    title: "StudiRad Excellence Grant",
    provider: "StudiRad Foundation",
    amount: "₦250,000",
    eligibility: "Final Year Students",
    deadline: "August 30, 2025",
    type: "Merit-based"
  },
  {
    id: 2,
    title: "ISRT Research Scholarship",
    provider: "International Society of Radiographers",
    amount: "$2,000",
    eligibility: "Postgraduate Students",
    deadline: "December 10, 2025",
    type: "Research"
  },
  {
    id: 3,
    title: "Women in STEM Radiography Award",
    provider: "TechHealth NGO",
    amount: "₦150,000",
    eligibility: "Female Undergraduates",
    deadline: "June 1, 2025",
    type: "Diversity"
  }
];

const ScholarshipsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-20 mt-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/opportunities" className="inline-flex items-center text-slate-500 hover:text-emerald-500 mb-8 font-medium">
          <FaArrowLeft className="mr-2" /> Back to Opportunities
        </Link>

        <div className="bg-emerald-900 rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Scholarships & Grants</h1>
            <p className="text-emerald-100 text-lg max-w-2xl">
              Financial support to help you focus on what matters most: your education and research.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {scholarships.map((scholarship) => (
            <div key={scholarship.id} className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-start md:items-center hover:border-emerald-200 transition-colors">
              <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 shrink-0">
                <FaGraduationCap size={32} />
              </div>
              
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{scholarship.title}</h3>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase">
                    {scholarship.type}
                  </span>
                </div>
                <p className="text-slate-500 mb-4">{scholarship.provider}</p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center text-slate-700 font-medium">
                    <FaMoneyBillWave className="mr-2 text-emerald-500" /> {scholarship.amount}
                  </div>
                  <div className="flex items-center text-slate-700">
                    <FaGlobe className="mr-2 text-slate-400" /> {scholarship.eligibility}
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-auto flex flex-col items-center gap-2 shrink-0">
                <button className="w-full md:w-auto px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors">
                  View Details
                </button>
                <span className="text-xs text-red-500 font-medium">
                  Deadline: {scholarship.deadline}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipsPage;
