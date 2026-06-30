import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div id="request-tutoring" className="mx-auto max-w-2xl overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl p-10 relative z-10 text-center">
            <h3 className="mb-4 text-3xl font-bold">Start Your Personalized Learning</h3>
            <p className="mb-10 text-slate-400">Step into your personal classroom. Book a session with us.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <input 
                    type="text" required placeholder="Full Name" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-xl border-0 bg-white/10 p-4 text-white focus:ring-2 focus:ring-amber-400 outline-none" 
                />
                <select 
                    value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}
                    className="w-full rounded-xl border-0 bg-white/10 p-4 text-orange focus:ring-2 focus:ring-amber-400 bg-slate-800"
                >
                  <option value="200L">200 Level</option>
                  <option value="300L">300 Level</option>
                  <option value="400L">400 Level</option>
                  <option value="500L">500 Level</option>
                </select>
              </div>
              <button type="submit" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-10 py-4 text-lg font-bold text-gray-900 shadow-xl transition-all hover:scale-105">
                 Configure My Plan <span className="ml-2"><FaArrowRight /></span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CourseInfoExtras;