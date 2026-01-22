import React, { useState, useEffect } from 'react';
import { FaUserGraduate, FaArrowLeft, FaCalendarAlt, FaCheckCircle, FaAward, FaGlobe } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { adminDb } from '../../firebase';
import { Loader2, AlertCircle } from 'lucide-react';
import { ScholarshipListing } from '../../types';
import SEO from '../../components/SEO';

const getDeadlineStatus = (deadline: string | null | undefined) => {
  if (!deadline) return { label: 'Ongoing', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  if (isNaN(deadlineDate.getTime())) return { label: 'Ongoing', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
  if (deadlineDate < today) return { label: 'Expired', color: 'text-red-600 bg-red-50 border-red-100' };
  return { label: 'Active', color: 'text-emerald-600 bg-emerald-50 border border-emerald-100' };
};

const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState<ScholarshipListing[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<ScholarshipListing | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = adminDb.collection('scholarships')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot: any) => {
        const data = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        }));
        setScholarships(data);
        setLoading(false);
      }, (error: any) => {
        console.error("Error fetching scholarships:", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const openModal = (item: ScholarshipListing) => setSelectedScholarship(item);
  const closeModal = () => setSelectedScholarship(null);

  return (
    <div className="min-h-screen bg-slate-50 py-20 mt-16 font-sans">
      <SEO title="Radiography Scholarships" description="Explore scholarship opportunities and academic funding for radiography students globally." />
      
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/opportunities" className="inline-flex items-center text-slate-500 hover:text-emerald-500 mb-8 font-bold transition-colors">
          <FaArrowLeft className="mr-2" /> Back to Opportunities
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
           <div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Academic Funding</h1>
             <p className="text-slate-600 mt-2">Scholarships and grants for radiography students.</p>
           </div>
           <Link to="/employer/login" className="px-6 py-3 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 shadow-sm">
             Post Opportunity
           </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          </div>
        ) : scholarships.length === 0 ? (
           <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm border border-slate-200">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <AlertCircle size={40} />
             </div>
             <h3 className="text-2xl font-bold text-slate-800">No Scholarships Found</h3>
             <p className="text-slate-500 mt-2">Check back soon for new funding opportunities!</p>
           </div>
        ) : (
          <div className="grid gap-6">
            {scholarships.map((scholarship) => {
              const status = getDeadlineStatus(scholarship.deadline);
              return (
                <div key={scholarship.id} className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 hover:border-emerald-300 transition-all hover:shadow-2xl group relative overflow-hidden">
                  <div className="bg-emerald-50 text-emerald-600 w-24 h-24 rounded-[2rem] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <FaAward size={40} />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                       <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{scholarship.title}</h3>
                       <span className={`text-[9px] uppercase font-black px-3 py-1 rounded-full border ${status.color}`}>
                        {status.label}
                       </span>
                    </div>
                    
                    {/* Fix: Access organization property using type assertion as it's not explicitly in the ScholarshipListing interface but may exist in legacy documents */}
                    <p className="text-slate-500 font-bold text-sm mb-6 flex items-center gap-2">
                       <FaGlobe className="text-emerald-400" /> {scholarship.provider || (scholarship as any).organization || "International Provider"}
                    </p>
                    
                    <div className="flex flex-wrap gap-10 text-sm font-bold text-slate-400 mb-8">
                       <div>
                          <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">Value</p>
                          {/* Fix: Access salaryOrAmount property using type assertion as it's not explicitly in the ScholarshipListing interface but may exist in documents */}
                          <p className="text-emerald-600 font-black text-lg">{scholarship.amount || (scholarship as any).salaryOrAmount || "Full Tuition"}</p>
                       </div>
                       <div>
                          <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">Eligibility</p>
                          <p className="text-slate-700">{scholarship.eligibility || "International Students"}</p>
                       </div>
                       <div>
                          <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">Deadline</p>
                          <p className="text-slate-700">{scholarship.deadline || "Ongoing"}</p>
                       </div>
                    </div>
                    
                    <button 
                      onClick={() => openModal(scholarship)}
                      className="px-10 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95"
                    >
                      View Eligibility & Apply
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedScholarship && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-slate-100 bg-white sticky top-0 z-20 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{selectedScholarship.title}</h2>
                <div className="flex items-center gap-4 text-slate-500 font-bold text-sm">
                   {/* Fix: Access organization property via type assertion for document compatibility */}
                   <span className="flex items-center gap-2"><FaAward className="text-emerald-500" /> {selectedScholarship.provider || (selectedScholarship as any).organization}</span>
                </div>
              </div>
              <button onClick={closeModal} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                <AlertCircle className="w-6 h-6 text-slate-400 rotate-45" />
              </button>
            </div>

            <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-5 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <FaAward size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Scholarship Value</span>
                    {/* Fix: Access salaryOrAmount property via type assertion for document compatibility */}
                    <p className="font-black text-slate-800 text-lg">{selectedScholarship.amount || (selectedScholarship as any).salaryOrAmount || "Full/Partial"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
                    <FaCalendarAlt size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Deadline</span>
                    <p className="font-black text-slate-800 text-lg">{selectedScholarship.deadline || "Ongoing"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">About This Scholarship</h3>
                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 text-slate-600 leading-relaxed whitespace-pre-line text-sm font-medium">
                  {selectedScholarship.description || "No detailed description provided."}
                </div>
              </div>

              {selectedScholarship.requirements && selectedScholarship.requirements.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Application Requirements</h3>
                  <div className="grid gap-3">
                    {selectedScholarship.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-4 bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100/50 text-slate-700 text-sm font-bold">
                        <FaCheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={16} />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(selectedScholarship.contactInfo || selectedScholarship.link) && (
                <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100">
                  <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Instructions</h3>
                  <p className="text-amber-900 font-black text-lg">{selectedScholarship.contactInfo || "Follow the application link below."}</p>
                </div>
              )}
            </div>

            <div className="p-10 border-t border-slate-100 bg-slate-50">
              <a 
                href={selectedScholarship.link || selectedScholarship.applyLink || "#"}
                target="_blank" rel="noopener noreferrer"
                className={`w-full py-5 font-black rounded-2xl transition-all text-center text-lg shadow-xl shadow-emerald-100 ${
                  (selectedScholarship.link || selectedScholarship.applyLink) 
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
                onClick={(e) => !(selectedScholarship.link || selectedScholarship.applyLink) && e.preventDefault()}
              >
                {(selectedScholarship.link || selectedScholarship.applyLink) ? "Apply Now" : "Review Instructions Above"}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScholarshipsPage;