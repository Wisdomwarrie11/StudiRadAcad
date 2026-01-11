import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, GraduationCap, Briefcase, ChevronRight } from 'lucide-react';

const TargetAudience: React.FC = () => {
  const targets = [
    {
      id: 'freshers',
      icon: Sparkles,
      title: "New & Interested",
      desc: "Curious about Radiography? Learn what it takes to start this fulfilling career path.",
      link: "/freshers",
      btnText: "Explore the Basics",
      color: "amber"
    },
    {
      id: 'students',
      icon: GraduationCap,
      title: "Current Students",
      desc: "Boost your clinical skills with specialized classes and our daily radiography challenge.",
      link: "/classes",
      btnText: "Join the Academy",
      color: "indigo"
    },
    {
      id: 'professionals',
      icon: Briefcase,
      title: "Professionals",
      desc: "Find your next career move with internships, locum shifts, and latest job postings.",
      link: "/opportunities",
      btnText: "View Opportunities",
      color: "emerald"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Tailored For Your Journey</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Wherever you are in your radiography career, StudiRad has the tools to help you succeed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {targets.map((target, idx) => (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 hover:shadow-2xl hover:bg-white transition-all duration-500 overflow-hidden"
            >
              {/* Subtle background icon */}
              <target.icon className={`absolute -right-8 -bottom-8 w-40 h-40 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 text-${target.color}-600`} />
              
              <div className={`w-14 h-14 rounded-2xl bg-${target.color}-100 text-${target.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <target.icon size={28} />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3">{target.title}</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">{target.desc}</p>

              <Link 
                to={target.link}
                className={`inline-flex items-center gap-2 font-black text-sm uppercase tracking-widest text-${target.color}-600 group-hover:gap-3 transition-all`}
              >
                {target.btnText} <ChevronRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;