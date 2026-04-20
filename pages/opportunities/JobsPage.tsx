
import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaClock, FaBuilding, FaArrowLeft, FaMoneyBillWave, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { adminDb } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Loader2, AlertCircle, MapPin, Filter, X } from 'lucide-react';
import { JobListing } from '../../types';
import SEO from '../../components/SEO';

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", 
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", 
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", 
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

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
  const [filterState, setFilterState] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(adminDb, 'jobs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as JobListing[];
      setJobs(jobsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredJobs = jobs.filter(job => {
    if (!filterState) return true;
    // Check if the selected state is mentioned in the location string
    return job.location?.toLowerCase().includes(filterState.toLowerCase());
  });

  const openModal = (job: JobListing) => setSelectedJob(job);
  const closeModal = () => setSelectedJob(null);
  const formatDate = (dateString: string) => dateString ? new Date(dateString).toLocaleDateString() : 'Recently';

  return (
    <div className="min-h-screen bg-slate-200 text-slate-900 py-20 mt-16 font-sans relative overflow-hidden">
      <SEO title="Radiography Jobs" description="Browse the latest radiography job openings from verified sources." />
      
      {/* Decorative Grid Lines */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <Link to="/opportunities" className="inline-flex items-center text-slate-500 hover:text-brand-primary mb-8 font-mono text-[10px] uppercase tracking-widest transition-colors">
          <span className="mr-2"><FaArrowLeft /></span> Back to System.Opportunities
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8">
          <div>
             <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-slate-400 block mb-2">Module: Career_Listings</span>
             <h1 className="text-4xl md:text-5xl font-serif italic font-light text-slate-900 tracking-tight leading-none">
               Job <span className="font-sans font-black uppercase tracking-tighter text-brand-primary">Openings</span>
             </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
             {/* State Filter Dropdown */}
             <div className="relative group min-w-[220px]">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors">
                  <MapPin size={16} />
                </div>
                <select 
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white border border-slate-300 rounded-lg font-bold text-xs text-slate-700 outline-none focus:border-brand-primary appearance-none cursor-pointer shadow-sm transition-all"
                >
                  <option value="">All States (Nigeria)</option>
                  {NIGERIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                  <Filter size={12} />
                </div>
             </div>

             <Link to="/employer/login" className="px-8 py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-brand-primary transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10 active:scale-95">
                Post as Facility
             </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
          </div>
        ) : filteredJobs.length === 0 ? (
           <div className="text-center py-24 bg-slate-50/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-300 animate-in fade-in slide-in-from-bottom-4">
             <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 text-slate-300 border border-slate-200">
               <AlertCircle size={32} />
             </div>
             <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">No Records Found</h3>
             <p className="text-slate-500 max-w-sm mx-auto mt-2 text-sm font-medium">
               {filterState 
                ? `We couldn't find any jobs in ${filterState} at the moment.` 
                : "Check back later for new openings!"}
             </p>
             {filterState && (
               <button 
                onClick={() => setFilterState('')}
                className="mt-8 px-8 py-3 bg-white border border-slate-300 text-slate-600 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
               >
                 Clear Filter
               </button>
             )}
           </div>
        ) : (
          <div className="grid gap-8">
            {filteredJobs.map((job, idx) => {
              const status = getDeadlineStatus(job.deadline);
              return (
                <div key={job.id} className="bg-slate-50/80 backdrop-blur-md rounded-2xl p-10 shadow-sm border border-slate-300 hover:shadow-xl hover:border-slate-400 transition-all group relative overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                  <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 flex-wrap mb-3">
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-brand-primary transition-colors">{job.title}</h3>
                        <span className={`text-[9px] uppercase font-mono font-bold px-3 py-1 rounded border ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center text-slate-500 space-x-8 text-[11px] font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-2"><span className="text-slate-400"><FaBuilding /></span> {job.organization}</span>
                        <span className="flex items-center gap-2"><span className="text-slate-400"><FaMapMarkerAlt /></span> {job.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                      <span className="px-4 py-2 bg-slate-900 text-white rounded-md text-[9px] font-mono uppercase tracking-[0.2em]">
                        {job.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest flex items-center">
                        <span className="mr-2"><FaClock /></span> {formatDate(job.postedAt)}
                      </span>
                    </div>
                  </div>
                  
                  {job.description && (
                    <p className="text-slate-600 mb-10 line-clamp-2 text-sm leading-relaxed font-medium max-w-3xl">{job.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between pt-8 border-t border-slate-200">
                    <button 
                      onClick={() => openModal(job)}
                      className="px-8 py-3.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-brand-primary transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                    >
                      View Details
                    </button>
                    {job.salaryOrAmount && (
                      <div className="text-right">
                         <p className="text-[9px] text-slate-400 font-mono uppercase tracking-[0.2em] mb-1">Remuneration</p>
                         <p className="text-xl font-black text-emerald-600 tracking-tighter">{job.salaryOrAmount}</p>
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
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-slate-300">
            <div className="p-10 border-b border-slate-200 bg-white sticky top-0 z-20 flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-slate-400 block mb-2">Record_ID: {selectedJob.id?.slice(0, 8)}</span>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-3">{selectedJob.title}</h2>
                <div className="flex flex-wrap items-center gap-6 text-slate-500 font-bold text-[11px] uppercase tracking-widest">
                   <span className="flex items-center gap-2"><span className="text-slate-400"><FaBuilding /></span> {selectedJob.organization}</span>
                   <span className="flex items-center gap-2"><span className="text-slate-400"><FaMapMarkerAlt /></span> {selectedJob.location}</span>
                </div>
              </div>
              <button onClick={closeModal} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-10 space-y-12 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-center gap-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <FaMoneyBillWave size={20} />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-mono tracking-widest block mb-1">Remuneration</span>
                    <p className="font-black text-slate-800 text-base tracking-tight">{selectedJob.salaryOrAmount || "Negotiable"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                    <FaCalendarAlt size={20} />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-mono tracking-widest block mb-1">Deadline</span>
                    <p className="font-black text-slate-800 text-base tracking-tight">{selectedJob.deadline || "Open"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-slate-200"></span> Job Description
                </h3>
                <div className="bg-white rounded-xl p-8 border border-slate-200 text-slate-600 leading-relaxed whitespace-pre-line text-sm font-medium shadow-sm">
                  {selectedJob.description}
                </div>
              </div>

              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-slate-200"></span> Requirements
                  </h3>
                  <div className="grid gap-4">
                    {selectedJob.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-4 bg-emerald-50/20 p-5 rounded-xl border border-emerald-100/50 text-slate-700 text-sm font-bold">
                        <span className="text-emerald-500 mt-1 shrink-0"><FaCheckCircle size={14} /></span>
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedJob.contactInfo && (
                <div className="p-8 bg-slate-900 text-white rounded-xl border border-white/10 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><FaBuilding size={60} /></div>
                  <h3 className="text-[9px] font-mono text-slate-400 uppercase tracking-[0.4em] mb-4">Application_Protocol</h3>
                  <p className="text-white font-bold text-lg leading-relaxed relative z-10">{selectedJob.contactInfo}</p>
                </div>
              )}
            </div>

            <div className="p-10 border-t border-slate-200 bg-white">
              <a 
                href={selectedJob.link || "#"}
                target="_blank" rel="noopener noreferrer"
                className={`w-full py-5 font-bold rounded-lg transition-all text-center text-xs uppercase tracking-[0.2em] shadow-xl ${
                  selectedJob.link 
                    ? "bg-slate-900 text-white hover:bg-brand-primary active:scale-95" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
                onClick={(e) => !selectedJob.link && e.preventDefault()}
              >
                {selectedJob.link ? "Execute Application" : "Apply via Contact Info Above"}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
