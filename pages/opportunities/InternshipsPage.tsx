import React, { useState, useEffect } from 'react';
import { FaUniversity, FaMapMarkerAlt, FaArrowLeft, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { adminDb as db } from '../../firebase';
import { Loader2, AlertCircle, Clock } from 'lucide-react';

interface InternshipListing {
  id: string;
  title: string;
  organization: string;
  location: string;
  duration: string;
  deadline?: string;
  description?: string;
  requirements?: string[];
  salaryOrAmount?: string; 
  contactInfo?: string;
  link?: string;
}

// Helper to calculate deadline status
const getDeadlineStatus = (deadline: string | null | undefined) => {
  if (!deadline) return { label: 'Not specified', color: 'text-slate-500 bg-slate-100 border-slate-200' };
  
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  
  if (isNaN(deadlineDate.getTime())) return { label: 'Not specified', color: 'text-slate-500 bg-slate-100 border-slate-200' };
  
  if (deadlineDate < today) return { label: 'Expired', color: 'text-red-600 bg-red-50 border-red-100' };
  return { label: 'Active', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
};

const InternshipsPage = () => {
  const [internships, setInternships] = useState<InternshipListing[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<InternshipListing | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = db.collection('internships')
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

  const handlePostInternship = () => {
    navigate('/admin/post-opportunity');
  };

  const openModal = (item: InternshipListing) => {
    setSelectedInternship(item);
  };

  const closeModal = () => {
    setSelectedInternship(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 mt-16 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/opportunities" className="inline-flex items-center text-slate-500 hover:text-indigo-500 mb-8 font-medium transition-colors">
          <FaArrowLeft className="mr-2" /> Back to Opportunities
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
           <div>
             <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Internship Programs</h1>
             <p className="text-slate-600 mt-2">Kickstart your career with practical experience.</p>
           </div>
           <button 
            onClick={handlePostInternship}
            className="mt-4 md:mt-0 px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors flex items-center gap-2"
          >
            Post Internship <span className="text-[10px] bg-slate-400 text-white px-1.5 py-0.5 rounded uppercase font-black">Admin</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        ) : internships.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <AlertCircle className="w-8 h-8 text-slate-400" />
             </div>
             <h3 className="text-lg font-bold text-slate-700">No Internships Available</h3>
             <p className="text-slate-500">Check back later or post one if you are an admin.</p>
           </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {internships.map((internship) => {
              const status = getDeadlineStatus(internship.deadline);
              return (
                <div key={internship.id} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col hover:border-indigo-300 transition-all hover:shadow-xl hover:shadow-indigo-500/5 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-sm shadow-indigo-100">
                      <FaUniversity size={24} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {internship.duration && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200">
                          {internship.duration}
                        </span>
                      )}
                      <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">{internship.title}</h3>
                  <p className="text-indigo-600 font-bold text-sm mb-6">{internship.organization}</p>
                  
                  <div className="space-y-3 text-sm text-slate-500 mb-8 font-medium">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 mr-3 text-indigo-300 shrink-0" /> {internship.location}
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="w-4 h-4 mr-3 text-indigo-300 shrink-0" /> Deadline: {internship.deadline || "Not specified"}
                    </div>
                  </div>
                  
                  {internship.description && (
                    <p className="text-slate-600 text-sm mb-8 flex-grow line-clamp-3 leading-relaxed">{internship.description}</p>
                  )}
                  
                  <button 
                    onClick={() => openModal(internship)}
                    className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 transform active:scale-[0.98]"
                  >
                    View & Apply
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- DETAILS MODAL --- */}
      {selectedInternship && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={closeModal}></div>
          
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-8 border-b border-slate-100 bg-white sticky top-0 z-20 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">{selectedInternship.title}</h2>
                  <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full border ${getDeadlineStatus(selectedInternship.deadline).color}`}>
                      {getDeadlineStatus(selectedInternship.deadline).label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 font-bold text-sm">
                   <span className="flex items-center gap-2"><FaUniversity className="text-indigo-400" /> {selectedInternship.organization}</span>
                   <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-indigo-400" /> {selectedInternship.location}</span>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <AlertCircle className="w-6 h-6 text-slate-400 rotate-45" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                    <FaUniversity size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Stipend</span>
                    <p className="font-bold text-slate-800">{selectedInternship.salaryOrAmount || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
                    <FaCalendarAlt size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Deadline</span>
                    <p className="font-bold text-slate-800">{selectedInternship.deadline || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {selectedInternship.description && (
                <div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Description</h3>
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 text-slate-600 leading-relaxed whitespace-pre-line text-sm font-medium">
                    {selectedInternship.description}
                  </div>
                </div>
              )}

              {selectedInternship.requirements && selectedInternship.requirements.length > 0 && (
                <div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Requirements</h3>
                  <div className="grid gap-3">
                    {selectedInternship.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 text-slate-700 text-sm font-bold">
                        <FaCheckCircle className="text-indigo-500 mt-0.5 shrink-0" size={14} />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedInternship.contactInfo && (
                <div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Contact Info</h3>
                  <p className="text-slate-700 font-bold bg-amber-50 p-4 rounded-2xl border border-amber-100 text-sm">
                    {selectedInternship.contactInfo}
                  </p>
                </div>
              )}

            </div>

            {/* Footer / Actions */}
            <div className="p-8 border-t border-slate-100 bg-slate-50">
              <div className="flex flex-col gap-4">
                <a 
                  href={selectedInternship.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 font-black rounded-2xl transition-all text-center shadow-lg shadow-indigo-100 ${
                    selectedInternship.link 
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]" 
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    if (!selectedInternship.link) e.preventDefault();
                  }}
                >
                  {selectedInternship.link ? "Apply Directly" : "No Direct Contact Available"}
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipsPage;