
import React from 'react';
import { BrainCircuit, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WeeklyQuiz: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-lg p-8 border-l-8 border-brand-accent">
          <div className="flex items-start gap-6 mb-6 md:mb-0">
            <div className="bg-brand-dark p-4 rounded-xl text-brand-accent hidden sm:block">
              <BrainCircuit size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-dark mb-2">StudiRad Challenge</h3>
              <p className="text-gray-600 max-w-lg">
                Can you beat the <strong>Master Level</strong>? Start from Basics and work your way up. 
                <span className="block mt-1 text-sm text-brand-primary font-semibold">Limited to 2 attempts per user.</span>
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/resources/quiz')}
            className="w-full md:w-auto px-8 py-3 bg-brand-dark text-white font-bold rounded-lg hover:bg-brand-primary transition-colors flex items-center justify-center gap-2"
          >
            Take Challenge <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default WeeklyQuiz;
