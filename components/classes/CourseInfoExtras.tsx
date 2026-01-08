import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM;
import {
  FaBook,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaStar,
  FaArrowRight,
  FaGem
} from 'react-icons/fa';

const CourseInfoExtras: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    level: '200L'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/tutoring-booking', { 
      state: { name: formData.name, level: formData.level } 
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <h3 className="flex items-center justify-center text-3xl font-bold text-gray-900 gap-3">
              <FaBook className="text-indigo-600" /> One-on-One Tutoring
            </h3>
            <p className="mt-2 text-gray-600">Evening classes (6pm-10pm) tailored to your specific clinical needs.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { title: "Standard", icon: FaStar, color: "bg-slate-100", textColor: "text-slate-500", desc: "1 Month / 1 Course" },
              { title: "Silver", icon: FaGraduationCap, color: "bg-amber-100", textColor: "text-amber-500", desc: "2 Months / 3 Courses" },
              { title: "Diamond", icon: FaChalkboardTeacher, color: "bg-indigo-50", textColor: "text-indigo-600", desc: "3 Months / 5 Courses" },
              { title: "Custom", icon: FaGem, color: "bg-emerald-50", textColor: "text-emerald-600", desc: "Special Requests" }
            ].map((pkg, idx) => (
              <div key={idx} className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-lg">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${pkg.color} ${pkg.textColor}`}>
                  <pkg.icon size={24} />
                </div>
                <h4 className="mb-1 text-xl font-bold text-gray-900">{pkg.title}</h4>
                <p className="text-gray-600 text-xs leading-relaxed">{pkg.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div id="request-tutoring" className="mx-auto max-w-2xl overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl p-10 relative z-10 text-center">
            <h3 className="mb-4 text-3xl font-bold">Start Your Personalized Learning</h3>
            <p className="mb-10 text-slate-400">Step into the classroom. View our evening schedules and pricing packages.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <input 
                    type="text" required placeholder="Full Name" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-xl border-0 bg-white/10 p-4 text-white focus:ring-2 focus:ring-amber-400 outline-none" 
                />
                <select 
                    value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}
                    className="w-full rounded-xl border-0 bg-white/10 p-4 text-white focus:ring-2 focus:ring-amber-400 bg-slate-800"
                >
                  <option value="200L">200 Level</option>
                  <option value="300L">300 Level</option>
                  <option value="400L">400 Level</option>
                  <option value="500L">500 Level</option>
                  <option value="Post Graduate">Post Graduate</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>
              <button type="submit" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-10 py-4 text-lg font-bold text-gray-900 shadow-xl transition-all hover:scale-105">
                 Configure My Plan <FaArrowRight className="ml-2" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CourseInfoExtras;