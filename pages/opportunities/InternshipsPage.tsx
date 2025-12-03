
import React from 'react';
import { FaUniversity, FaMapMarkerAlt, FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const internships = [
  {
    id: 1,
    title: "Summer Radiography Intern",
    organization: "Evercare Hospital",
    location: "Lekki, Lagos",
    duration: "3 Months",
    deadline: "May 20, 2025",
    description: "A rotational internship covering General X-ray, Fluoroscopy, and basic CT observation."
  },
  {
    id: 2,
    title: "Graduate Trainee Program",
    organization: "Me Cure Healthcare",
    location: "Oshodi, Lagos",
    duration: "1 Year",
    deadline: "Rolling Admission",
    description: "Intensive training program for fresh graduates looking to specialize in MRI or Nuclear Medicine."
  },
  {
    id: 3,
    title: "Clinical Attachment",
    organization: "National Hospital Abuja",
    location: "Abuja",
    duration: "6 Months",
    deadline: "April 15, 2025",
    description: "Hands-on clinical attachment for 400L and 500L Radiography students."
  }
];

const InternshipsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-20 mt-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/opportunities" className="inline-flex items-center text-slate-500 hover:text-indigo-500 mb-8 font-medium">
          <FaArrowLeft className="mr-2" /> Back to Opportunities
        </Link>

        <div className="mb-10">
           <h1 className="text-3xl font-bold text-slate-900">Internship Programs</h1>
           <p className="text-slate-600 mt-2">Kickstart your career with practical experience.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {internships.map((internship) => (
            <div key={internship.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col hover:border-indigo-300 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
                  <FaUniversity size={24} />
                </div>
                <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                  {internship.duration}
                </span>
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
              
              <p className="text-slate-600 text-sm mb-6 flex-grow">{internship.description}</p>
              
              <button className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InternshipsPage;
