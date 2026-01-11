import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaGlobe, FaArrowLeft, FaMoneyBillWave, FaCalendarAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { adminDb as db } from '../../firebase';
import { Loader2, AlertCircle } from 'lucide-react';

interface ScholarshipListing {
  id: string;
  title: string;
  organization: string; // provider
  salaryOrAmount?: string; // DB field is salaryOrAmount
  type: string;
  deadline: string;
  description: string;
  requirements: string[];
  contactInfo?: string;
  link?: string;
}

const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState<ScholarshipListing[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<ScholarshipListing | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = db.collection('scholarships')
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

  const handlePostScholarship = () => {
    navigate('/admin/post-opportunity');
  };

  const openModal = (item: ScholarshipListing) => {
    setSelectedScholarship(item);
  };

  const closeModal = () => {
    setSelectedScholarship(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 mt-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/opportunities" className="inline-flex items-center text-slate-500 hover:text-emerald-500 mb-8 font-medium">
          <FaArrowLeft className="mr-2" /> Back to Opportunities
        </Link>

        <div className="bg-emerald-900 rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
               <div>
                 <h1 className="text-3xl md:text-4xl font-bold mb-4">Scholarships & Grants</h1>
                 <p className="text-emerald-100 text-lg max-w-2xl">
                   Financial support to help you focus on what matters most: your education and research.
                 </p>
               </div>
               <button 
                onClick={handlePostScholarship}
                className="mt-6 md:mt-0 px-6 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 backdrop-blur-sm border border-white/10"
              >
                Post Grant <span className="text-xs bg-emerald-600 text-white px-1.5 py-0.5 rounded">Admin</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          </div>
        ) : scholarships.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <AlertCircle className="w-8 h-8 text-slate-400" />
             </div>
             <h3 className="text-lg font-bold text-slate-700">No Scholarships Available</h3>
             <p className="text-slate-500">New grants will be listed here when available.</p>
           </div>
        ) : (
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
                  <p className="text-slate-500 mb-4">{scholarship.organization}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center text-slate-700 font-medium">
                      <FaMoneyBillWave className="mr-2 text-emerald-500" /> {scholarship.salaryOrAmount || "See Details"}
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-auto flex flex-col items-center gap-2 shrink-0">
                  <button 
                    onClick={() => openModal(scholarship)}
                    className="w-full md:w-auto px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    View Details
                  </button>
                  <span className="text-xs text-red-500 font-medium">
                    Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- DETAILS MODAL --- */}
      {selectedScholarship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
          
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-20 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedScholarship.title}</h2>
                <div className="flex items-center gap-2 text-slate-500 mt-1">
                   <FaGraduationCap /> {selectedScholarship.organization}
                </div>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-2xl font-light">&times;</button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <FaMoneyBillWave />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-bold">Value</span>
                    <p className="font-semibold text-slate-800">{selectedScholarship.salaryOrAmount || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-bold">Deadline</span>
                    <p className="font-semibold text-slate-800">{selectedScholarship.deadline}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{selectedScholarship.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Eligibility / Requirements</h3>
                {selectedScholarship.requirements && selectedScholarship.requirements.length > 0 ? (
                   <ul className="space-y-2">
                    {selectedScholarship.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600">
                        <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 italic">No specific requirements listed.</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Contact Info</h3>
                <p className="text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {selectedScholarship.contactInfo || "Refer to application link."}
                </p>
              </div>

            </div>

            {/* Footer / Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <div className="flex flex-col gap-3">
                
                {/* Apply via Agent */}
                {/* <div className="w-full">
                  <button 
                    onClick={() => alert("Application request sent to StudiRad Agent. We will review the listing and contact you.")}
                    className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors mb-2"
                  >
                    Apply through StudiRad Agent
                  </button>
                  <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-100">
                    <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>Disclaimer:</strong> StudiRad facilitates the application process but does not guarantee selection.
                    </p>
                  </div>
                </div> */}

                {/* <div className="flex items-center gap-3 my-1">
                   <div className="h-px bg-slate-300 flex-grow"></div>
                   <span className="text-slate-400 text-sm font-semibold">OR</span>
                   <div className="h-px bg-slate-300 flex-grow"></div>
                </div> */}

                {/* Apply Directly */}
                <a 
                  href={selectedScholarship.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 font-bold rounded-xl transition-colors text-center ${
                    selectedScholarship.link 
                      ? "bg-white border-2 border-slate-200 text-emerald-600 hover:border-emerald-400 hover:bg-slate-50" 
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    if (!selectedScholarship.link) e.preventDefault();
                  }}
                >
                  {selectedScholarship.link ? "Apply Directly to Provider" : "No Direct Contact Available"}
                </a>

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ScholarshipsPage;