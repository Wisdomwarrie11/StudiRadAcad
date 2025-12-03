import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaBook,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaStar,
  FaArrowRight
} from 'react-icons/fa';

interface FormData {
  name: string;
  role: string;
  course: string;
  topic: string;
}

const CourseInfoExtras: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: 'Student',
    course: '',
    topic: '',
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, role, course, topic } = formData;
    if (!name || !course || !topic) {
      alert("Please fill in all fields.");
      return;
    }

    const message = `My name is ${name}, I am a ${role}, I need a one-on-one tutoring on ${topic} in the course ${course}.`;
    const whatsappLink = `https://wa.me/2347041197027?text=${encodeURIComponent(message)}`;

    window.open(whatsappLink, "_blank");
    setShowAlert(true);
    setFormData({ name: '', role: 'Student', course: '', topic: '' });

    setTimeout(() => setShowAlert(false), 6000);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* --- Understanding Course Levels (Cards instead of Table) --- */}
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
              Course Levels
            </h3>
            <p className="mt-2 text-gray-600">Choose the right path for your radiography journey.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Beginner */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500"></div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <FaStar className="h-6 w-6" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-gray-900">Beginner</h4>
              <p className="text-gray-600 leading-relaxed">
                Learn foundational concepts, safety protocols, and equipment basics. Perfect for students just starting out.
              </p>
            </div>

            {/* Intermediate */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500"></div>
               <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <FaGraduationCap className="h-6 w-6" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-gray-900">Intermediate</h4>
              <p className="text-gray-600 leading-relaxed">
                Dive deeper into clinical applications and anatomy reviews. Ideal for refining your existing skills.
              </p>
            </div>

            {/* Advanced */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500"></div>
               <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <FaChalkboardTeacher className="h-6 w-6" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-gray-900">Advanced</h4>
              <p className="text-gray-600 leading-relaxed">
                Focuses on interpretation, optimization, and advanced protocols. For professionals seeking mastery.
              </p>
            </div>
          </div>
        </motion.div>

        {/* --- Free vs Paid Courses --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-10">
             <h3 className="flex items-center justify-center text-3xl font-bold text-gray-900 gap-3">
              <FaStar className="text-amber-400" /> 
              Free vs Paid
            </h3>
            <p className="mt-2 text-gray-600">Compare the benefits of our course packages.</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-white">
            <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-50/80 p-4 font-bold text-gray-900">
              <div className="col-span-1">Feature</div>
              <div className="col-span-1 text-center">Free Courses</div>
              <div className="col-span-1 text-center text-indigo-600">Paid Courses</div>
            </div>
            
            {[
              { label: "Access to Lessons", free: true, paid: true },
              { label: "Weekly Feedback", free: false, paid: true },
              { label: "Tutor Interaction", free: false, paid: true },
              { label: "Completion Certificate", free: false, paid: true }
            ].map((item, index) => (
              <div key={index} className={`grid grid-cols-3 items-center p-4 transition-colors hover:bg-gray-50 ${index !== 3 ? 'border-b border-gray-100' : ''}`}>
                <div className="col-span-1 text-sm font-medium text-gray-700">{item.label}</div>
                <div className="col-span-1 flex justify-center">
                  {item.free ? <FaCheckCircle className="text-emerald-500 h-5 w-5" /> : <FaTimesCircle className="text-gray-300 h-5 w-5" />}
                </div>
                <div className="col-span-1 flex justify-center">
                  {item.paid ? <FaCheckCircle className="text-indigo-600 h-5 w-5 shadow-sm rounded-full" /> : <FaTimesCircle className="text-gray-300 h-5 w-5" />}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* --- One-on-One Tutorial Request Form --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
            <div className="relative p-10 md:p-14">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-amber-500 opacity-20 blur-3xl"></div>

              <div className="relative z-10">
                <h3 className="mb-4 text-center text-3xl font-bold">
                  Request One-on-One Tutoring
                </h3>
                <p className="mb-10 text-center text-slate-300">
                  Need personalized guidance? Fill out the form below and we'll connect you with an expert tutor via WhatsApp.
                </p>

                {showAlert && (
                  <div className="mb-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-4 text-center text-emerald-200">
                    Request sent! We'll reply in about <strong>45 minutes</strong>.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-slate-300">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-xl border-0 bg-white/10 p-3 text-white placeholder:text-slate-500 focus:bg-white/20 focus:ring-2 focus:ring-amber-400 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="role" className="text-sm font-medium text-slate-300">Role</label>
                      <select
                        name="role"
                        id="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full rounded-xl border-0 bg-white/10 p-3 text-white focus:bg-white/20 focus:ring-2 focus:ring-amber-400 transition-all [&>option]:bg-slate-800"
                      >
                        <option value="Student">Student</option>
                        <option value="Radiographer">Radiographer</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="course" className="text-sm font-medium text-slate-300">Course</label>
                      <input
                        type="text"
                        name="course"
                        id="course"
                        placeholder="e.g. Chest X-ray"
                        value={formData.course}
                        onChange={handleChange}
                        className="w-full rounded-xl border-0 bg-white/10 p-3 text-white placeholder:text-slate-500 focus:bg-white/20 focus:ring-2 focus:ring-amber-400 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="topic" className="text-sm font-medium text-slate-300">Topic of Interest</label>
                      <input
                        type="text"
                        name="topic"
                        id="topic"
                        placeholder="e.g. Positioning"
                        value={formData.topic}
                        onChange={handleChange}
                        className="w-full rounded-xl border-0 bg-white/10 p-3 text-white placeholder:text-slate-500 focus:bg-white/20 focus:ring-2 focus:ring-amber-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-6 text-center">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-10 py-4 text-lg font-bold text-gray-900 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 hover:shadow-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                      Request Session <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CourseInfoExtras;
