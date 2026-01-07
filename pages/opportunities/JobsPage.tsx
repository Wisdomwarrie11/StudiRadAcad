import React, { useState, useEffect } from 'react';
import { FaUniversity, FaMapMarkerAlt, FaArrowLeft, FaCalendarAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { adminDb as db } from '../../firebase';
import { Loader2, AlertCircle } from 'lucide-react';

interface InternshipListing {
  id: string;
  title: string;
  organization: string;
  location: string;
  duration: string;
  deadline: string;
  description: string;
  requirements: string[];
  salaryOrAmount?: string; // Stipend
  contactInfo?: string;
  link?: string;
}

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
    <div className="min-h-screen bg-slate-50 py-20 mt-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/opportunities" className="inline-flex items-center text-slate-500 hover:text-indigo-500 mb-8 font-medium">
          <FaArrowLeft className="mr-2" /> Back to Opportunities
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
           <div>
             <h1 className="text-3xl font-bold text-slate-900">Internship Programs</h1>
             <p className="text-slate-600 mt-2">Kickstart your career with practical experience.</p>
           </div>
           <button 
            onClick={handlePostInternship}
            className="mt-4 md:mt-0 px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-2"
          >
            Post Internship <span className="text-xs bg-slate-400 text-white px-1.5 py-0.5 rounded">Admin</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        ) : internships.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <AlertCircle className="w-8 h-8 text-slate-400" />
             </div>
             <h3 className="text-lg font-bold text-slate-700">No Internships Available</h3>
             <p className="text-slate-500">Check back later or post one if you are an admin.</p>
           </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {internships.map((internship) => (
              <div key={internship.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col hover:border-indigo-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
                    <FaUniversity size={24} />
                  </div>
                  {internship.duration && (
                    <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                      {internship.duration}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-1">{internship.title}</h3>
                <p className="text-indigo-600 font-medium text-sm mb-4">{internship.organization}</p>
                
                <div className="space-y-2 text-sm text-slate-500 mb-6">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 opacity-70" /> {internship.location}
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="w-4 h-4 mr-2 opacity-70" /> Deadline: {internship.deadline}
                  </div>
                </div>
                
                <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3">{internship.description}</p>
                
                <button 
                  onClick={() => openModal(internship)}
                  className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  View & Apply
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- DETAILS MODAL --- */}
      {selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
          
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-20 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedInternship.title}</h2>
                <div className="flex items-center gap-2 text-slate-500 mt-1">
                   <FaUniversity /> {selectedInternship.organization} &bull; <FaMapMarkerAlt /> {selectedInternship.location}
                </div>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-2xl font-light">&times;</button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <FaUniversity />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-bold">Stipend</span>
                    <p className="font-semibold text-slate-800">{selectedInternship.salaryOrAmount || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-bold">Deadline</span>
                    <p className="font-semibold text-slate-800">{selectedInternship.deadline}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{selectedInternship.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Requirements</h3>
                {selectedInternship.requirements && selectedInternship.requirements.length > 0 ? (
                   <ul className="space-y-2">
                    {selectedInternship.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600">
                        <FaCheckCircle className="text-indigo-500 mt-1 flex-shrink-0" />
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
                  {selectedInternship.contactInfo || "Refer to application link."}
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
                      <strong>Disclaimer:</strong> StudiRad is not affiliated with this facility. 
                      We facilitate the application process.
                    </p>
                  </div>
                </div> */}

                <div className="flex items-center gap-3 my-1">
                   <div className="h-px bg-slate-300 flex-grow"></div>
                   <span className="text-slate-400 text-sm font-semibold">OR</span>
                   <div className="h-px bg-slate-300 flex-grow"></div>
                </div>

                {/* Apply Directly */}
                <a 
                  href={selectedInternship.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 font-bold rounded-xl transition-colors text-center ${
                    selectedInternship.link 
                      ? "bg-white border-2 border-slate-200 text-indigo-600 hover:border-indigo-400 hover:bg-slate-50" 
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    if (!selectedInternship.link) e.preventDefault();
                  }}
                >
                  {selectedInternship.link ? "Apply Directly to Organization" : "No Direct Contact Available"}
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