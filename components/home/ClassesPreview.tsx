import React from 'react';
import { Star, Clock, ChevronRight, Zap, Activity, Brain, Disc } from 'lucide-react';
import { Course } from '../../types';
import { Link, useLocation } from 'react-router-dom';

const courses: Course[] = [
  {
    id: "1",
    title: "Introduction to Radiation Physics",
    level: "Beginner",
    duration: "4 Weeks",
    rating: 4.7,
    image: "x-ray.jpeg"
  },
  {
    id: "2",
    title: "Obstetrics Ultrasound",
    level: "Intermediate",
    duration: "6 Weeks",
    rating: 4.9,
    image: "obs.jpeg"},
  {
    id: "3",
    title: "Advanced MRI Imaging",
    level: "Advanced",
    duration: "8 Weeks",
    rating: 4.8,
    image: "MRIpro.jpeg"
  },
  {
    id: "4",
    title: "CT Physics & Instrumentation",
    level: "Beginner",
    duration: "8 Weeks",
    rating: 4.3,
    image: "CtInter.jpeg"
  }
];

const modalities = [
  { id: "xray", title: "X-ray", icon: Zap, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "ultrasound", title: "Ultrasound", icon: Activity, color: "text-purple-500", bg: "bg-purple-50" },
  { id: "mri", title: "MRI", icon: Disc, color: "text-indigo-500", bg: "bg-indigo-50" },
  { id: "ct", title: "CT", icon: Brain, color: "text-teal-500", bg: "bg-teal-50" },
];

const ClassesPreview: React.FC = () => {
  return (
    <section id="classes" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Modalities Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-base font-bold text-brand-primary uppercase tracking-wider mb-2">Browse by Modality</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-brand-dark">Find Your Specialization</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {modalities.map((mod) => (
              <div key={mod.id} className={`${mod.bg} rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform cursor-pointer border border-transparent hover:border-gray-200 shadow-sm`}>
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-white flex items-center justify-center shadow-sm ${mod.color}`}>
                  <mod.icon size={24} />
                </div>
                <h4 className="font-bold text-gray-800 text-lg">{mod.title}</h4>
                <p className="text-xs text-gray-500 mt-1">View Classes</p>
              </div>
            ))}
          </div>
        </div>

        {/* Courses List */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <div>
            <h2 className="text-base font-bold text-brand-primary uppercase tracking-wider mb-2">New Arrivals</h2>
            <h3 className="text-3xl font-bold text-brand-dark">Latest Courses</h3>
          </div>
          <Link to = "/classes/#classes" className="hidden md:flex items-center gap-2 text-brand-primary font-bold hover:text-brand-accent transition-colors">
            View All Courses <ChevronRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-dark shadow-sm">
                  {course.level}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-1 text-brand-accent mb-2">
                  <Star size={14} fill="currentColor" />
                  <span className="text-gray-600 text-xs font-bold">{course.rating}</span>
                </div>
                <h4 className="text-lg font-bold text-brand-dark mb-2 leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                  {course.title}
                </h4>
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                    <Clock size={14} />
                    <span>{course.duration}</span>
                  </div>
                  <span className="text-brand-primary text-sm font-bold cursor-pointer hover:underline">Enroll Now</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <a href= "classes">
          <button className="px-6 py-3 border-2 border-brand-primary text-brand-primary font-bold rounded-lg hover:bg-brand-primary hover:text-white transition-colors">
            View All Courses
          </button>
          </a>
         
        </div>
      </div>
    </section>
  );
};

export default ClassesPreview;