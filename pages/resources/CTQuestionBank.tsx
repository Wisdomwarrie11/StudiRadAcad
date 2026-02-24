
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, GraduationCap, Clock, Award } from 'lucide-react';
import { CT_TOPICS } from '../../data/ctQuestions';

const CTQuestionBank: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-light/30 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-5 rounded-full bg-brand-primary/10 text-brand-primary font-medium text-sm mb-4"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Professional Growth Center
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-brand-dark mb-6 tracking-tight"
          >
            CT Question Bank – PGC
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-brand-muted max-w-2xl mx-auto"
          >
            Enhance your Computed Tomography knowledge with our comprehensive, 
            topic-based question bank designed for pre-intern radiographers undergoing the PGC CT Course, Enugu 2026.
          </motion.p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CT_TOPICS.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * (index + 1) }}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/resources/ct-bank/${topic.id}`)}
              className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-primary/5 overflow-hidden flex flex-col"
            >
              <div className="h-3 bg-brand-primary w-full" />
              <div className="p-8 flex-grow">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                  <BookOpen className="w-6 h-6 text-brand-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-primary transition-colors">
                  {topic.title}
                </h3>
                <p className="text-brand-muted text-sm leading-relaxed mb-6">
                  {topic.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs font-medium text-brand-muted mt-auto">
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1 text-brand-accent" />
                    {topic.questions.length} Questions
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    ~{Math.ceil(topic.questions.length * 0.75)} mins
                  </div>
                </div>
              </div>
              
              <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between group-hover:bg-brand-primary/5 transition-colors">
                <span className="text-sm font-semibold text-brand-primary">Start Practice</span>
                <ChevronRight className="w-4 h-4 text-brand-primary transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
          
         
        </div>
      </div>
    </div>
  );
};

export default CTQuestionBank;
