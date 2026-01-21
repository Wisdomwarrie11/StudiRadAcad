import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaClock, FaBuilding, FaArrowLeft, FaMoneyBillWave, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { adminDb } from '../../firebase';
import { Loader2, AlertCircle } from 'lucide-react';
import { JobListing } from '../../types';
import SEO from '../../components/SEO';

const getDeadlineStatus = (deadline: string | null | undefined) => {
  if (!deadline) return { label: 'Active', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  if (isNaN(deadlineDate.getTime())) return { label: 'Active', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
  if (deadlineDate < today) return { label: 'Expired', color: 'text-red-600 bg-red-50 border-red-100' };
  return { label: 'Active', color: 'text-emerald-600 bg-emerald-50 border border-emerald-100' };
};

const JobsPage = () => {
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = adminDb.collection('jobs')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot: any) => {
        const jobsData = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        }));
        setJobs(jobsData);
        setLoading(false);
      }, (error: any) => {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const openModal = (job: JobListing) => setSelectedJob(job);
  const closeModal = () => setSelectedJob(null);
  const formatDate = (dateString: string) => dateString ? new Date(dateString).toLocaleDateString() : 'Recently';

  return (
    <div className="min-h-screen bg-slate-50 py-20 mt-16 font-sans">
      <SEO title="Radiography Jobs" description="Browse the latest radiography job openings from verified sources." />
      
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/opportunities" className="inline-flex items-center text-slate-500 hover:text-amber-500 mb-8 font-bold transition-colors">
          <FaArrowLeft className="mr-2" /> Back to Opportunities
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Job Openings</h1>
             <p className="text-slate-600 mt-2">Latest opportunities in Radiography and Medical Imaging.</p>
          </div>
          <div className="flex gap-3">
             <Link to="/employer/login" className="px-6 py-3 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                Post as Facility
             </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
           <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm border border-slate-200">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <AlertCircle size={40} />
             </div>
             <h3 className="text-2xl font-bold text-slate-800">No Jobs Listed Yet</h3>
             <p className="text-slate-500 max-w-sm mx-auto mt-2">Check back later for new openings!</p>
           </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => {
              const status = getDeadlineStatus(job.deadline);
              return (
                <div key={job.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-amber-200 transition-all group relative overflow-hidden">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-brand-primary transition-colors">{job.title}</h3>
                        <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center text-slate-500 space-x-6 text-sm font-bold">
                        <span className="flex items-center gap-2"><FaBuilding className="text-amber-500" /> {job.organization}</span>
                        <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-amber-500" /> {job.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                      <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {job.type}
                      </span>
                      <span className="text-[11px] text-slate-400 font-bold flex items-center">
                        <FaClock className="mr-1" /> {formatDate(job.postedAt)}
                      </span>
                    </div>
                  </div>
                  
                  {job.description && (
                    <p className="text-slate-500 mb-8 line-clamp-2 text-sm leading-relaxed font-medium">{job.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <button 
                      onClick={() => openModal(job)}
                      className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-brand-primary transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                    >
                      View Details
                    </button>
                    {job.salaryOrAmount && (
                      <div className="text-right">
                         <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Remuneration</p>
                         <p className="text-lg font-black text-emerald-600">{job.salaryOrAmount}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-slate-100 bg-white sticky top-0 z-20 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedJob.title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 font-bold text-sm">
                   <span className="flex items-center gap-2"><FaBuilding className="text-amber-500" /> {selectedJob.organization}</span>
                   <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-amber-500" /> {selectedJob.location}</span>
                </div>
              </div>
              <button onClick={closeModal} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                <AlertCircle className="w-6 h-6 text-slate-400 rotate-45" />
              </button>
            </div>

            <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-5 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                    <FaMoneyBillWave size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Remuneration</span>
                    <p className="font-black text-slate-800 text-lg">{selectedJob.salaryOrAmount || "Negotiable"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <FaCalendarAlt size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Deadline</span>
                    <p className="font-black text-slate-800 text-lg">{selectedJob.deadline || "Open"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Job Description</h3>
                <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100 text-slate-600 leading-relaxed whitespace-pre-line text-sm font-medium">
                  {selectedJob.description}
                </div>
              </div>

              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Requirements</h3>
                  <div className="grid gap-3">
                    {selectedJob.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-4 bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100/50 text-slate-700 text-sm font-bold">
                        <FaCheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={16} />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedJob.contactInfo && (
                <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100">
                  <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">How to Apply</h3>
                  <p className="text-amber-900 font-black text-lg">{selectedJob.contactInfo}</p>
                </div>
              )}
            </div>

            <div className="p-10 border-t border-slate-100 bg-slate-50">
              <a 
                href={selectedJob.link || "#"}
                target="_blank" rel="noopener noreferrer"
                className={`w-full py-5 font-black rounded-2xl transition-all text-center text-lg shadow-xl ${
                  selectedJob.link 
                    ? "bg-slate-900 text-white hover:bg-brand-primary active:scale-95" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
                onClick={(e) => !selectedJob.link && e.preventDefault()}
              >
                {selectedJob.link ? "Apply Online" : "Apply via Contact Info Above"}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;