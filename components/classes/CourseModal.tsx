import React from 'react';
import { FaUsers, FaTimes, FaBookOpen } from 'react-icons/fa';
import { MdOutlineSchool } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { Course } from '../../types';

interface CourseModalProps {
  show: boolean;
  handleClose: () => void;
  course: Course | null;
}

const levelStyles = {
  Beginner: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Intermediate: 'bg-amber-100 text-amber-800 border-amber-200',
  Advanced: 'bg-rose-100 text-rose-800 border-rose-200',
};

const CourseModal: React.FC<CourseModalProps> = ({ show, handleClose, course }) => {
  if (!course) return null;

  const handleSubscribe = () => {
    // Replace this with your actual payment platform link
    window.open("https://your-payment-platform.com/checkout", "_blank");
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 bg-gray-50/50 px-8 py-6">
              <div className="pr-8">
                <h3 className="text-2xl font-bold text-slate-900">
                  {course.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {course.category} • {course.rating} ⭐
                </p>
              </div>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            {/* Body */}
            <div className="p-8">
              <div className="mb-8 rounded-xl bg-blue-50 p-4 text-blue-900 flex items-start gap-3">
                 <FaBookOpen className="mt-1 flex-shrink-0 text-blue-500" />
                 <p className="text-sm">
                    This class follows the <strong>RRBN curriculum</strong> for Nigerians.{' '}
                    <a href="#" className="font-semibold text-blue-700 underline decoration-blue-300 hover:decoration-blue-700">
                      Download course outline
                    </a>
                  </p>
              </div>

              <div className="mb-8 flex flex-wrap items-center gap-4">
                <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${levelStyles[course.level] || 'bg-gray-100'}`}>
                  {course.level}
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  {course.price || "₦ —"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-10">
                <div className="flex items-center rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-500 shadow-sm">
                    <FaUsers />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase text-gray-500">Enrolled</span>
                    <span className="font-bold text-gray-900">{course.enrolled || "20+ Students"}</span>
                  </div>
                </div>
                <div className="flex items-center rounded-lg border border-gray-100 bg-gray-50 p-3">
                   <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-500 shadow-sm">
                    <MdOutlineSchool />
                  </div>
                   <div>
                    <span className="block text-xs font-semibold uppercase text-gray-500">Duration</span>
                    <span className="font-bold text-gray-900">{course.duration || "6-week Cohort"}</span>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="rounded-2xl bg-slate-900 p-8 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-white/5 blur-2xl"></div>
                <div className="relative z-10">
                  <h5 className="mb-2 text-xl font-bold">Ready to Start Learning?</h5>
                  <p className="mb-6 text-sm text-slate-300 max-w-sm mx-auto">
                    Subscribe now to gain access to all course materials, weekly feedback sessions,
                    and one-on-one tutor interactions.
                  </p>
                  <button
                    onClick={handleSubscribe}
                    className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-amber-400 px-8 py-3 text-base font-bold text-slate-900 shadow-lg shadow-amber-400/20 transition-transform hover:scale-105 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CourseModal;
