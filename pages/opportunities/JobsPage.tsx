import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaClock, FaBuilding, FaArrowLeft, FaMoneyBillWave, FaCalendarAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { adminDb as db } from '../../firebase';
import { Loader2, AlertCircle } from 'lucide-react';

interface JobListing {
  id: string;
  title: string;
  organization: string; // company
  location: string;
  type: string;
  postedAt: string;
  description: string;
  requirements: string[];
  salaryOrAmount?: string;
  deadline: string;
  contactInfo?: string; // contactAddress
  link?: string; // directApplyLink
}

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

  // Helper to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 mt-16 relative">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/opportunities" className="inline-flex items-center text-slate-500 hover:text-amber-500 mb-8 font-medium">
          <FaArrowLeft className="mr-2" /> Back to Opportunities
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
             <h1 className="text-3xl font-bold text-slate-900">Job Openings</h1>
             <p className="text-slate-600 mt-2">Latest opportunities in Radiography and Medical Imaging.</p>
          </div>
          <button 
            onClick={handlePostJob}
            className="mt-4 md:mt-0 px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-2"
          >
            Post a Job <span className="text-xs bg-slate-400 text-white px-1.5 py-0.5 rounded">Admin</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <AlertCircle className="w-8 h-8 text-slate-400" />
             </div>
             <h3 className="text-lg font-bold text-slate-700">No Job Openings Yet</h3>
             <p className="text-slate-500">Check back later or post a job if you are an admin.</p>
           </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-amber-300 transition-all">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                    <div className="flex items-center text-slate-500 mt-1 space-x-4 text-sm">
                      <span className="flex items-center"><FaBuilding className="mr-1.5" /> {job.organization}</span>
                      <span className="flex items-center"><FaMapMarkerAlt className="mr-1.5" /> {job.location}</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
                      {job.type}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center">
                      <FaClock className="mr-1" /> {formatDate(job.postedAt)}
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-6 line-clamp-2">{job.description}</p>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => openModal(job)}
                    className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Apply Now
                  </button>
                  <button className="px-5 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- JOB DETAILS MODAL --- */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
          
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-20 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedJob.title}</h2>
                <div className="flex items-center gap-2 text-slate-500 mt-1">
                   <FaBuilding /> {selectedJob.organization} &bull; <FaMapMarkerAlt /> {selectedJob.location}
                </div>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-2xl font-light">&times;</button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              
              {/* Key Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <FaMoneyBillWave />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-bold">Salary</span>
                    <p className="font-semibold text-slate-800">{selectedJob.salaryOrAmount || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-bold">Deadline</span>
                    <p className="font-semibold text-slate-800">{selectedJob.deadline}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Job Description</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Requirements</h3>
                {selectedJob.requirements && selectedJob.requirements.length > 0 ? (
                   <ul className="space-y-2">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600">
                        <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 italic">No specific requirements listed.</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Contact Address</h3>
                <p className="text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {selectedJob.contactInfo || "Refer to application link."}
                </p>
              </div>

            </div>

            {/* Footer / Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <div className="flex flex-col gap-3">
                
                {/* Apply via Agent */}
                <div className="w-full">
                  <button 
                    onClick={() => alert("Application request sent to StudiRad Agent. We will review the listing and contact you.")}
                    className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors mb-2"
                  >
                    Apply through StudiRad Agent
                  </button>
                  <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-100">
                    <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>Disclaimer:</strong> StudiRad is not affiliated with this hospital/facility. 
                      We do not promise jobs but facilitate the application process.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 my-1">
                   <div className="h-px bg-slate-300 flex-grow"></div>
                   <span className="text-slate-400 text-sm font-semibold">OR</span>
                   <div className="h-px bg-slate-300 flex-grow"></div>
                </div>

                {/* Apply Directly */}
                <a 
                  href={selectedJob.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 font-bold rounded-xl transition-colors text-center ${
                    selectedJob.link 
                      ? "bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50" 
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    if (!selectedJob.link) e.preventDefault();
                  }}
                >
                  {selectedJob.link ? "Apply Directly to Facility" : "No Direct Contact Available"}
                </a>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default JobsPage;