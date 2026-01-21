import React, { useState, useEffect } from 'react';
import { FaUniversity, FaMapMarkerAlt, FaArrowLeft, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { adminDb } from '../../firebase';
import { Loader2, AlertCircle } from 'lucide-react';
import { InternshipListing } from '../../types';
import SEO from '../../components/SEO';

const getDeadlineStatus = (deadline: string | null | undefined) => {
  if (!deadline) return { label: 'Active', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  if (isNaN(deadlineDate.getTime())) return { label: 'Active', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
  if (deadlineDate < today) return { label: 'Expired', color: 'text-red-600 bg-red-50 border-red-100' };
  return { label: 'Active', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
};

const InternshipsPage = () => {
  const [internships, setInternships] = useState<InternshipListing[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<InternshipListing | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = adminDb.collection('internships')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot: any) => {
        const data = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        }));
        setInternships(data);
        setLoading(false);
      }, (error: any) => {
        console.error("Error fetching internships:", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const openModal = (item: InternshipListing) => setSelectedInternship(item);
  const closeModal = () => setSelectedInternship(null);

  return (
    <div className="min-h-screen bg-slate-50 py-20 mt-16 font-sans">
      <SEO title="Radiography Internships" description="Find clinical internship placements in medical imaging facilities." />
      
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/opportunities" className="inline-flex items-center text-slate-500 hover:text-indigo-500 mb-8 font-bold transition-colors">
          <FaArrowLeft className="mr-2" /> Back to Opportunities
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
           <div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Internship Programs</h1>
             <p className="text-slate-600 mt-2">Kickstart your clinical career with practical experience.</p>
           </div>
           <Link to="/employer/login" className="px-6 py-3 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 shadow-sm">
             List Placement
           </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        ) : internships.length === 0 ? (
           <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm border border-slate-200">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <AlertCircle size={40} />
             </div>
             <h3 className="text-2xl font-bold text-slate-800">No Placements Available</h3>
             <p className="text-slate-500 mt-2 max-w-sm mx-auto">Check back soon for new internship posts.</p>
           </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {internships.map((internship) => {
              const status = getDeadlineStatus(internship.deadline);
              return (
                <div key={internship.id} className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 flex flex-col hover:border-indigo-300 transition-all hover:shadow-2xl group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-8">
                    <div className="bg-indigo-50 text-indigo-600 p-5 rounded-[2rem] group-hover:scale-110 transition-transform shadow-sm">
                      <FaUniversity size={28} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-[9px] uppercase font-black px-3 py-1 rounded-full border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{internship.title}</h3>
                  <p className="text-indigo-600 font-black text-sm mb-8">{internship.organization}</p>
                  
                  <div className="space-y-4 text-sm text-slate-500 mb-10 font-bold">
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="w-4 h-4 text-indigo-400" /> {internship.location}
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <FaClock className="w-4 h-4 text-indigo-400" /> {internship.duration || "Standard Duration"}
                    </div>
                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="w-4 h-4 text-indigo-400" /> Deadline: {internship.deadline || "Ongoing"}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => openModal(internship)}
                    className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                  >
                    View & Apply
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedInternship && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-slate-100 bg-white sticky top-0 z-20 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2">{selectedInternship.title}</h2>
                <div className="flex items-center gap-4 text-slate-500 font-bold text-sm">
                   <span className="flex items-center gap-2"><FaUniversity className="text-indigo-400" /> {selectedInternship.organization}</span>
                   <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-indigo-400" /> {selectedInternship.location}</span>
                </div>
              </div>
              <button onClick={closeModal} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                <AlertCircle className="w-6 h-6 text-slate-400 rotate-45" />
              </button>
            </div>

            <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-5 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <FaUniversity size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Stipend / Support</span>
                    <p className="font-black text-slate-800 text-lg">{selectedInternship.salaryOrAmount || "As per policy"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
                    <FaCalendarAlt size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Deadline</span>
                    <p className="font-black text-slate-800 text-lg">{selectedInternship.deadline || "Ongoing"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Placement Description</h3>
                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 text-slate-600 leading-relaxed whitespace-pre-line text-sm font-medium">
                  {selectedInternship.description}
                </div>
              </div>

              {selectedInternship.requirements && selectedInternship.requirements.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Requirements</h3>
                  <div className="grid gap-3">
                    {selectedInternship.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-4 bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100/50 text-slate-700 text-sm font-bold">
                        <FaCheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={16} />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedInternship.contactInfo && (
                <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100">
                  <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">How to Apply</h3>
                  <p className="text-amber-900 font-black text-lg">{selectedInternship.contactInfo}</p>
                </div>
              )}
            </div>

            <div className="p-10 border-t border-slate-100 bg-slate-50">
              <a 
                href={selectedInternship.link || "#"}
                target="_blank" rel="noopener noreferrer"
                className={`w-full py-5 font-black rounded-2xl transition-all text-center text-lg shadow-xl shadow-indigo-100 ${
                  selectedInternship.link 
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
                onClick={(e) => !selectedInternship.link && e.preventDefault()}
              >
                {selectedInternship.link ? "Apply Directly" : "Contact Facility Above"}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipsPage;