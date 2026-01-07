import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM;
import {
  FaBook,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaStar,
  FaArrowRight
} from 'react-icons/fa';
import { saveTutoringLead } from '../../services/tutorialService';

interface FormData {
  name: string;
  level: string;
  course: string;
  topic: string;
}

const CourseInfoExtras: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    level: '200L',
    course: '',
    topic: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, level, course, topic } = formData;
    if (!name || !course || !topic) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save Lead Tracking to Firestore (silent backend step)
      await saveTutoringLead({
        name,
        level,
        initialCourse: course,
        initialTopic: topic
      });

      // 2. Redirect to Booking Page to customize the schedule
      // We no longer open WhatsApp here, only at the final step of the booking process
      navigate('/tutoring-booking', { 
        state: { 
          name, 
          level,
          initialCourse: course 
        } 
      });
    } catch (err) {
      console.error("Lead saving error:", err);
      // Even if firestore fails, we proceed to the booking page for a better UX
      navigate('/tutoring-booking', { 
        state: { name, level, initialCourse: course } 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* --- Tier Info --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <h3 className="flex items-center justify-center text-3xl font-bold text-gray-900 gap-3">
              <FaBook className="text-indigo-600" /> 
              Tutoring Packages
            </h3>
            <p className="mt-2 text-gray-600">Specialized curriculum tailored to your academic stage.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-lg">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-300"></div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <FaStar className="h-6 w-6" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-gray-900">Silver Package</h4>
              <p className="text-gray-600 leading-relaxed text-sm">
                Focuses on foundational Radiography and Physics for 200L - 300L students.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-lg">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-400"></div>
               <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-500">
                <FaGraduationCap className="h-6 w-6" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-gray-900">Gold Package</h4>
              <p className="text-gray-600 leading-relaxed text-sm">
                Advanced clinical protocols and image interpretation for 400L - 500L students.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-lg">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600"></div>
               <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FaChalkboardTeacher className="h-6 w-6" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-gray-900">Diamond Package</h4>
              <p className="text-gray-600 leading-relaxed text-sm">
                Post-graduate research support and specialized modality mastery.
              </p>
            </div>
          </div>
        </motion.div>

        {/* --- Form --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div id="request-tutoring" className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl relative">
            <div className="p-10 md:p-14 relative z-10">
              <h3 className="mb-4 text-center text-3xl font-bold">Request Session</h3>
              <p className="mb-10 text-center text-slate-400">Enter your details to view tiered pricing and customize your schedule.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border-0 bg-white/10 p-3 text-white focus:ring-2 focus:ring-amber-400 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Academic Level</label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full rounded-xl border-0 bg-white/10 p-3 text-white focus:ring-2 focus:ring-amber-400 transition-all [&>option]:bg-slate-800"
                    >
                      <option value="200L">200 Level</option>
                      <option value="300L">300 Level</option>
                      <option value="400L">400 Level</option>
                      <option value="500L">500 Level</option>
                      <option value="Post Graduate">Post Graduate</option>
                      <option value="Professional">Professional</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Target Course</label>
                    <input
                      type="text"
                      name="course"
                      required
                      placeholder="e.g. MRI Physics"
                      value={formData.course}
                      onChange={handleChange}
                      className="w-full rounded-xl border-0 bg-white/10 p-3 text-white focus:ring-2 focus:ring-amber-400 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Topic Area</label>
                    <input
                      type="text"
                      name="topic"
                      required
                      placeholder="e.g. Signal Processing"
                      value={formData.topic}
                      onChange={handleChange}
                      className="w-full rounded-xl border-0 bg-white/10 p-3 text-white focus:ring-2 focus:ring-amber-400 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-6 text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-10 py-4 text-lg font-bold text-gray-900 shadow-xl transition-all hover:scale-105 disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Customize My Plan"} <FaArrowRight className="ml-2" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CourseInfoExtras;