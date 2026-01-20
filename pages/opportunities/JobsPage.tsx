import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaClock, FaBuilding, FaArrowLeft, FaMoneyBillWave, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { adminDb as db } from '../../firebase';
import { Loader2, AlertCircle, Calendar } from 'lucide-react';

interface JobListing {
  id: string;
  title: string;
  organization: string;
  location: string;
  type: string;
  postedAt: string;
  description?: string;
  requirements?: string[];
  salaryOrAmount?: string;
  deadline?: string;
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
  return { label: 'Active', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
};

const JobsPage = () => {
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = db.collection('jobs')
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

  const handlePostJob = () => {
    navigate('/admin/post-opportunity');
  };

  const openModal = (job: JobListing) => {
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 mt-16 relative font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/opportunities" className="inline-flex items-center text-slate-500 hover:text-amber-500 mb-8 font-medium transition-colors">
          <FaArrowLeft className="mr-2" /> Back to Opportunities
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
             <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Job Openings</h1>
             <p className="text-slate-600 mt-2">Latest opportunities in Radiography and Medical Imaging.</p>
          </div>
          <button 
            onClick={handlePostJob}
            className="mt-4 md:mt-0 px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors flex items-center gap-2"
          >
            Post a Job <span className="text-[10px] bg-slate-400 text-white px-1.5 py-0.5 rounded uppercase font-black">Admin</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <AlertCircle className="w-8 h-8 text-slate-400" />
             </div>
             <h3 className="text-lg font-bold text-slate-700">No Job Openings Yet</h3>
             <p className="text-slate-500">Check back later or post a job if you are an admin.</p>
           </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => {
              const status = getDeadlineStatus(job.deadline);
              return (
                <div key={job.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-amber-300 transition-all group">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{job.title}</h3>
                        <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full border ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center text-slate-500 space-x-4 text-sm">
                        <span className="flex items-center"><FaBuilding className="mr-1.5 opacity-70" /> {job.organization}</span>
                        <span className="flex items-center"><FaMapMarkerAlt className="mr-1.5 opacity-70" /> {job.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
                        {job.type}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium flex items-center">
                        <FaClock className="mr-1" /> Posted {formatDate(job.postedAt)}
                      </span>
                    </div>
                  </div>
                  
                  {job.description && (
                    <p className="text-slate-600 mb-6 line-clamp-2 text-sm leading-relaxed">{job.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => openModal(job)}
                        className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                      >
                        View Details
                      </button>
                    </div>
                    {job.salaryOrAmount && (
                      <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                        {job.salaryOrAmount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- JOB DETAILS MODAL --- */}
      {selectedJob && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={closeModal}></div>
          
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-8 border-b border-slate-100 bg-white sticky top-0 z-20 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <h2 className="text-2xl font-black text-slate-900">{selectedJob.title}</h2>
                   <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full border ${getDeadlineStatus(selectedJob.deadline).color}`}>
                      {getDeadlineStatus(selectedJob.deadline).label}
                   </span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 font-medium text-sm">
                   <span className="flex items-center gap-1.5"><FaBuilding className="text-slate-400" /> {selectedJob.organization}</span>
                   <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-slate-400" /> {selectedJob.location}</span>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <AlertCircle className="w-6 h-6 text-slate-400 rotate-45" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
              
              {/* Key Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
                    <FaMoneyBillWave size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Salary</span>
                    <p className="font-bold text-slate-800">{selectedJob.salaryOrAmount || "Salary Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                    <FaCalendarAlt size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Deadline</span>
                    <p className="font-bold text-slate-800">{selectedJob.deadline || "Deadline Not specified"}</p>
                  </div>
                </div>
              </div>

              {selectedJob.description && (
                <div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Job Description</h3>
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 text-slate-600 leading-relaxed whitespace-pre-line text-sm">
                    {selectedJob.description}
                  </div>
                </div>
              )}

              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Requirements</h3>
                  <div className="grid gap-3">
                    {selectedJob.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 text-slate-700 text-sm font-medium">
                        <FaCheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={14} />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedJob.contactInfo && (
                <div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Contact Info</h3>
                  <p className="text-slate-700 font-bold bg-amber-50 p-4 rounded-2xl border border-amber-100 text-sm">
                    {selectedJob.contactInfo}
                  </p>
                </div>
              )}

            </div>

            {/* Footer / Actions */}
            <div className="p-8 border-t border-slate-100 bg-slate-50">
              <div className="flex flex-col gap-4">
                <a 
                  href={selectedJob.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 font-black rounded-2xl transition-all text-center shadow-lg shadow-slate-200 ${
                    selectedJob.link 
                      ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]" 
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    if (!selectedJob.link) e.preventDefault();
                  }}
                >
                  {selectedJob.link ? "Apply Directly" : "No Link Available"}
                </a>
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-tighter">
                  StudiRad connects you to facilities but does not handle recruitment directly.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default JobsPage;