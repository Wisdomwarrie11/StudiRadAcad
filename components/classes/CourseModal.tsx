import React from 'react';
import { FaUsers, FaTimes } from 'react-icons/fa';
import { MdOutlineSchool } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { Course } from '../../types';

interface CourseModalProps {
  show: boolean;
  handleClose: () => void;
  course: Course | null;
}

const levelColors = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-xl font-bold text-blue-600">
                {course.title}
              </h3>
              <button
                onClick={handleClose}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="mb-4 text-gray-600">
                This class follows the <strong>RRBN curriculum</strong> for Nigerians.{' '}
                <a href="/course-outline.pdf" className="text-blue-500 hover:underline hover:text-blue-700">
                  Download course outline
                </a>
              </p>

              <div className="mb-6 flex items-center gap-4">
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${levelColors[course.level]}`}>
                  {course.level}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {course.price || "₦ —"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-8">
                <div className="flex items-center text-gray-700">
                  <FaUsers className="mr-3 h-5 w-5 text-gray-400" />
                  <span className="font-semibold mr-1">Students Enrolled:</span>
                  <span>{course.enrolled || "20+"}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MdOutlineSchool className="mr-3 h-5 w-5 text-gray-400" />
                  <span className="font-semibold mr-1">Duration:</span>
                  <span>{course.duration || "6-week Cohort"}</span>
                </div>
              </div>

              {/* Call to Action */}
              <div className="rounded-xl bg-gray-50 p-6 text-center border border-gray-100">
                <h5 className="mb-2 text-lg font-bold text-gray-900">Ready to Start Learning?</h5>
                <p className="mb-6 text-sm text-gray-500">
                  Subscribe now to gain access to all course materials, weekly feedback sessions,
                  and one-on-one tutor interactions.
                </p>
                <button
                  onClick={handleSubscribe}
                  className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-8 py-3 text-base font-bold text-gray-900 shadow-lg transition-transform hover:scale-105 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CourseModal;
