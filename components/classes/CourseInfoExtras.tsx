import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaBook,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaStar,
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* --- Understanding Course Levels --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h3 className="mb-8 flex items-center justify-center text-2xl font-bold text-gray-800">
            <FaBook className="mr-3 text-yellow-500" /> Understanding the Course Levels
          </h3>
          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                    <FaStar className="mr-2 text-green-500" /> Beginner
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">Learn foundational concepts, safety, and equipment basics.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                    <FaGraduationCap className="mr-2 text-yellow-500" /> Intermediate
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">Includes clinical applications and anatomy reviews.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                    <FaChalkboardTeacher className="mr-2 text-red-500" /> Advanced
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">Focuses on interpretation, optimization, and advanced imaging protocols.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* --- Free vs Paid Courses --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="mb-8 flex items-center justify-center text-2xl font-bold text-gray-800">
            <FaStar className="mr-3 text-yellow-500" /> Free vs Paid Course Packages
          </h3>
          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Feature</th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Free Courses</th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Paid Courses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Access to Lessons</td>
                  <td className="px-6 py-4 text-center"><FaCheckCircle className="mx-auto text-green-500 h-5 w-5" /></td>
                  <td className="px-6 py-4 text-center"><FaCheckCircle className="mx-auto text-green-500 h-5 w-5" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Weekly Feedback</td>
                  <td className="px-6 py-4 text-center"><FaTimesCircle className="mx-auto text-red-400 h-5 w-5" /></td>
                  <td className="px-6 py-4 text-center"><FaCheckCircle className="mx-auto text-green-500 h-5 w-5" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Tutor Interaction</td>
                  <td className="px-6 py-4 text-center"><FaTimesCircle className="mx-auto text-red-400 h-5 w-5" /></td>
                  <td className="px-6 py-4 text-center"><FaCheckCircle className="mx-auto text-green-500 h-5 w-5" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* --- One-on-One Tutorial Request Form --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
            <div className="p-8">
              <h3 className="mb-6 flex items-center justify-center text-2xl font-bold text-gray-800">
                <FaChalkboardTeacher className="mr-3 text-yellow-500" /> Request a One-on-One Tutorial
              </h3>

              {showAlert && (
                <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-200 text-center">
                  We will reply to you in about <strong>45 minutes</strong> via WhatsApp or email
                  to let you know if there are tutors available for this topic.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      name="role"
                      id="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
                    >
                      <option value="Student">Student</option>
                      <option value="Radiographer">Radiographer</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700">Course</label>
                    <input
                      type="text"
                      name="course"
                      id="course"
                      placeholder="e.g. Chest X-ray or MRI Fundamentals"
                      value={formData.course}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700">Topic of Interest</label>
                    <input
                      type="text"
                      name="topic"
                      id="topic"
                      placeholder="e.g. Image positioning"
                      value={formData.topic}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    className="rounded-full bg-yellow-400 px-8 py-3 text-base font-bold text-gray-900 shadow-md transition-transform hover:scale-105 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                  >
                    Request Session
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
