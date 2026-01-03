
import React from 'react';
import { FaHandshake, FaLightbulb, FaGlobeAfrica, FaChalkboardTeacher, FaLaptop, FaUserFriends } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="Radstudents1.jpg" 
            alt="Radiography Students" 
            className="w-full h-full object-cover"
            onError={(e) => {
                // Fallback if image missing
                (e.target as HTMLImageElement).src = 'radioroom.jpeg';
            }}
          />
          <div className="absolute inset-0 bg-slate-900/70"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            Meet<span className="text-amber-400">StudiRad</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Powering Radiography learning with innovation, access, and real connection.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 max-w-6xl">
        {/* What We Stand For */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">What We Stand For</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          StudiRad stands for academic excellence, continuous professional growth, accessible learning, ethical practice, and strong mentorship.          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1"
          >
             <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="mission1.jpeg" 
                  alt="Our Mission" 
                  className="w-auto h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'radlearning1.jpeg'; }}
                />
             </div>
          </motion.div>
          <div className="order-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                <FaLightbulb size={24} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">Our Mission</h3>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">
            StudiRad is committed to supporting radiography students and professionals by providing accessible, high-quality digital education, structured mentorship, and timely information on career opportunities—including jobs, internships, and scholarships—thereby bridging the gap between academic training and professional success            </p>
          </div>
        </div>

        {/* Vision Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 md:order-2"
          >
             <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="vision.jpeg" 
                  alt="Our Vision" 
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'visionpeople.jpg'; }}
                />
             </div>
          </motion.div>
          <div className="order-2 md:order-1">
             <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                <FaGlobeAfrica size={24} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">Our Vision</h3>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">
            To become the leading digital learning and mentorship hub that empowers radiography students and professionals globally to achieve academic excellence, clinical competence, and sustainable career growth.            </p>
          </div>
        </div>

        {/* Collaboration Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-24 border border-slate-100">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                  <FaHandshake size={24} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900">Support & Collaboration</h3>
              </div>
              <p className="text-lg text-slate-600 mb-6">
                Are you a Radiography professional, educator, or organization that believes in this mission? Let’s work together to expand access to quality learning.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-700">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full"></span> Partnering as a tutor or mentor
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full"></span> Donating learning materials or access
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full"></span> Sponsoring students or specific course series
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full"></span> Helping us spread the word
                </li>
              </ul>
              <a 
                href="mailto:studirad@gmail.com" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Contact Us: studirad@gmail.com
              </a>
            </div>
            <div className="relative h-64 md:h-full min-h-[300px] rounded-2xl overflow-hidden">
               <img 
                  src="colab.jpeg" 
                  alt="Collaboration" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
          </div>
        </div>

        {/* Values Cards */}
        <div className="text-center mb-12">
           <h2 className="text-3xl font-bold text-slate-900 mb-4">What You’ll Get</h2>
           <p className="text-slate-500">Everything you need to succeed in your radiography career.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "On-demand Courses",
              text: "Structured, affordable, and created just for Radiography students.",
              icon: FaLaptop,
              color: "text-blue-500",
              bg: "bg-blue-50"
            },
            {
              title: "Live Classes",
              text: "Join real-time interactive sessions with top-notch instructors.",
              icon: FaChalkboardTeacher,
              color: "text-amber-500",
              bg: "bg-amber-50"
            },
            {
              title: "1-on-1 Support",
              text: "Request personal guidance for tough concepts or clarity sessions.",
              icon: FaUserFriends,
              color: "text-emerald-500",
              bg: "bg-emerald-50"
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center"
            >
              <div className={`w-16 h-16 mx-auto ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                <item.icon size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
              <p className="text-slate-600">{item.text}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
