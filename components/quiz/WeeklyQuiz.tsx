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
              <h3 className="text-2xl font-bold text-brand-dark mb-2">Weekly Radiography Quiz</h3>
              <p className="text-gray-600 max-w-lg">
                Test your knowledge on <strong>General Radiography & Physics</strong>. Top scorers this week win a 50% discount on Advanced Courses!
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/resources/quiz')}
            className="w-full md:w-auto px-8 py-3 bg-brand-dark text-white font-bold rounded-lg hover:bg-brand-primary transition-colors flex items-center justify-center gap-2"
          >
            Take Quiz Now <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default WeeklyQuiz;