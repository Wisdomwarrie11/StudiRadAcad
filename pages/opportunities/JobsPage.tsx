
import React from 'react';
import { FaMapMarkerAlt, FaClock, FaBuilding, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const jobs = [
  {
    id: 1,
    title: "Senior Radiographer",
    company: "Lagos University Teaching Hospital",
    location: "Lagos, Nigeria",
    type: "Full-time",
    posted: "2 days ago",
    description: "Seeking an experienced radiographer to lead our MRI department. Must have 5+ years of experience with Siemens scanners."
  },
  {
    id: 2,
    title: "Diagnostic Radiographer",
    company: "Clina-Lancet Laboratories",
    location: "Abuja, Nigeria",
    type: "Full-time",
    posted: "1 week ago",
    description: "Join our fast-paced diagnostic team. Responsibilities include X-ray, Ultrasound, and patient care management."
  },
  {
    id: 3,
    title: "Locum Radiographer",
    company: "Reddingtton Hospital",
    location: "Lagos, Nigeria",
    type: "Part-time / Contract",
    posted: "3 weeks ago",
    description: "Flexible shifts available for CT and X-ray modalities. Competitive hourly rates."
  },
  {
    id: 4,
    title: "Sonographer",
    company: "Lily Hospitals",
    location: "Warri, Nigeria",
    type: "Full-time",
    posted: "Just now",
    description: "Specialized Sonographer needed for Obstetrics and Gynecology department."
  }
];

const JobsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-20 mt-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/opportunities" className="inline-flex items-center text-slate-500 hover:text-amber-500 mb-8 font-medium">
          <FaArrowLeft className="mr-2" /> Back to Opportunities
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
             <h1 className="text-3xl font-bold text-slate-900">Job Openings</h1>
             <p className="text-slate-600 mt-2">Latest opportunities in Radiography and Medical Imaging.</p>
          </div>
          <button className="mt-4 md:mt-0 px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors">
            Post a Job
          </button>
        </div>

        <div className="grid gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-amber-300 transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                  <div className="flex items-center text-slate-500 mt-1 space-x-4 text-sm">
                    <span className="flex items-center"><FaBuilding className="mr-1.5" /> {job.company}</span>
                    <span className="flex items-center"><FaMapMarkerAlt className="mr-1.5" /> {job.location}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
                    {job.type}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center">
                    <FaClock className="mr-1" /> {job.posted}
                  </span>
                </div>
              </div>
              
              <p className="text-slate-600 mb-6">{job.description}</p>
              
              <div className="flex gap-3">
                <button className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors">
                  Apply Now
                </button>
                <button className="px-5 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
