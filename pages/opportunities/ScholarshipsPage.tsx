import React, { useState, useEffect } from 'react';
import { FaUserGraduate, FaArrowLeft, FaCalendarAlt, FaCheckCircle, FaAward, FaGlobe } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { adminDb } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Loader2, AlertCircle, X } from 'lucide-react';
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
    const q = query(collection(adminDb, 'scholarships'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as ScholarshipListing[];
      setScholarships(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching scholarships:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openModal = (item: ScholarshipListing) => setSelectedScholarship(item);
  const closeModal = () => setSelectedScholarship(null);

  return (
    <div className="min-h-screen bg-slate-200 text-slate-900 py-20 mt-16 font-sans relative overflow-hidden">
      <SEO title="Radiography Scholarships" description="Explore scholarship opportunities and academic funding for radiography students globally." />
      
      {/* Decorative Grid Lines */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <Link to="/opportunities" className="inline-flex items-center text-slate-500 hover:text-brand-primary mb-8 font-mono text-[10px] uppercase tracking-widest transition-colors">
          <span className="mr-2"><FaArrowLeft /></span> Back to System.Opportunities
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
           <div>
             <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-slate-400 block mb-2">Module: Academic_Funding</span>
             <h1 className="text-4xl md:text-5xl font-serif italic font-light text-slate-900 tracking-tight leading-none">
               Scholarship <span className="font-sans font-black uppercase tracking-tighter text-brand-primary">Registry</span>
             </h1>
           </div>
           <Link to="/employer/login" className="px-8 py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-brand-primary transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10 active:scale-95">
             Post Opportunity
           </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
          </div>
        ) : scholarships.length === 0 ? (
           <div className="text-center py-24 bg-slate-50/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-300 animate-in fade-in slide-in-from-bottom-4">
             <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 text-slate-300 border border-slate-200">
               <AlertCircle size={32} />
             </div>
             <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">No Records Found</h3>
             <p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm font-medium">Check back soon for new funding opportunities!</p>
           </div>
        ) : (
          <div className="grid gap-8">
            {scholarships.map((scholarship) => {
              const status = getDeadlineStatus(scholarship.deadline);
              return (
                <div key={scholarship.id} className="bg-slate-50/80 backdrop-blur-md rounded-2xl p-10 shadow-sm border border-slate-300 flex flex-col md:flex-row gap-10 hover:border-slate-400 transition-all hover:shadow-2xl group relative overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                  <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="bg-white text-slate-900 w-24 h-24 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-slate-200 shadow-sm">
                    <FaAward size={32} />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                       <h3 className="text-2xl font-black text-slate-900 group-hover:text-brand-primary transition-colors uppercase tracking-tight">{scholarship.title}</h3>
                       <span className={`text-[9px] uppercase font-mono font-bold px-3 py-1 rounded border ${status.color}`}>
                        {status.label}
                       </span>
                    </div>
                    
                    <p className="text-brand-primary font-bold text-[11px] uppercase tracking-widest mb-8 flex items-center gap-2">
                       <span className="text-slate-400"><FaGlobe /></span> {scholarship.provider || (scholarship as any).organization || "International Provider"}
                    </p>
                    
                    <div className="flex flex-wrap gap-12 text-[11px] font-bold text-slate-400 mb-10 uppercase tracking-widest">
                       <div>
                          <p className="text-[9px] font-mono text-slate-400 mb-2">Value</p>
                          <p className="text-slate-900 font-black text-lg tracking-tight">{scholarship.amount || (scholarship as any).salaryOrAmount || "Full Tuition"}</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-mono text-slate-400 mb-2">Eligibility</p>
                          <p className="text-slate-700">{scholarship.eligibility || "Rad Students"}</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-mono text-slate-400 mb-2">Deadline</p>
                          <p className="text-slate-700">{scholarship.deadline || "Ongoing"}</p>
                       </div>
                    </div>
                    
                    <button 
                      onClick={() => openModal(scholarship)}
                      className="px-10 py-4 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-brand-primary transition-all shadow-xl shadow-slate-900/10 active:scale-95"
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
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-slate-300">
            <div className="p-10 border-b border-slate-200 bg-white sticky top-0 z-20 flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-slate-400 block mb-2">Record_ID: {selectedScholarship.id?.slice(0, 8)}</span>
                <h2 className="text-3xl font-black text-slate-900 leading-tight mb-3 uppercase tracking-tight">{selectedScholarship.title}</h2>
                <div className="flex items-center gap-6 text-slate-500 font-bold text-[11px] uppercase tracking-widest">
                   <span className="flex items-center gap-2"><span className="text-slate-400"><FaAward /></span> {selectedScholarship.provider || (selectedScholarship as any).organization}</span>
                </div>
              </div>
              <button onClick={closeModal} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-10 space-y-12 overflow-y-auto custom-scrollbar">
              {/* Disclaimer Alert */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4 items-start shadow-sm">
                 <AlertCircle className="text-amber-600 shrink-0 mt-1" size={18} />
                 <div>
                    <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-widest mb-1">Important Safety Notice</h4>
                    <p className="text-xs text-amber-800 font-medium leading-relaxed">
                       Please verify the provider and details before applying or sharing personal information. StudiRad acts as a facilitator and will not be responsible for any disputes or issues that may arise. By applying, you agree to our <Link to="/terms" className="underline font-bold">Terms of Service</Link>.
                    </p>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-center gap-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <FaAward size={20} />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-mono tracking-widest block mb-1">Scholarship Value</span>
                    <p className="font-black text-slate-800 text-base tracking-tight">{selectedScholarship.amount || (selectedScholarship as any).salaryOrAmount || "Full/Partial"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
                    <FaCalendarAlt size={20} />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-mono tracking-widest block mb-1">Deadline</span>
                    <p className="font-black text-slate-800 text-base tracking-tight">{selectedScholarship.deadline || "Ongoing"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-slate-200"></span> About This Scholarship
                </h3>
                <div className="bg-white rounded-xl p-8 border border-slate-200 text-slate-600 leading-relaxed whitespace-pre-line text-sm font-medium shadow-sm">
                  {selectedScholarship.description || "No detailed description provided."}
                </div>
              </div>

              {selectedScholarship.requirements && selectedScholarship.requirements.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-slate-200"></span> Application Requirements
                  </h3>
                  <div className="grid gap-4">
                    {selectedScholarship.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-4 bg-emerald-50/20 p-5 rounded-xl border border-emerald-100/50 text-slate-700 text-sm font-bold">
                        <span className="text-emerald-500 mt-1 shrink-0"><FaCheckCircle size={14} /></span>
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(selectedScholarship.contactInfo || selectedScholarship.link) && (
                <div className="p-8 bg-slate-900 text-white rounded-xl border border-white/10 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><FaAward size={60} /></div>
                  <h3 className="text-[9px] font-mono text-slate-400 uppercase tracking-[0.4em] mb-4">Application_Protocol</h3>
                  <p className="text-white font-bold text-lg leading-relaxed relative z-10">{selectedScholarship.contactInfo || "Follow the application link below."}</p>
                </div>
              )}
            </div>

            <div className="p-10 border-t border-slate-200 bg-white">
              <a 
                href={selectedScholarship.link || selectedScholarship.applyLink || "#"}
                target="_blank" rel="noopener noreferrer"
                className={`w-full py-5 font-bold rounded-lg transition-all text-center text-xs uppercase tracking-[0.2em] shadow-xl ${
                  (selectedScholarship.link || selectedScholarship.applyLink) 
                    ? "bg-slate-900 text-white hover:bg-brand-primary active:scale-95" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
                onClick={(e) => !(selectedScholarship.link || selectedScholarship.applyLink) && e.preventDefault()}
              >
                {(selectedScholarship.link || selectedScholarship.applyLink) ? "Execute Application" : "Review Instructions Above"}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScholarshipsPage;