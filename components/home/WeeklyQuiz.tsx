import React from 'react';
import { BrainCircuit, ArrowRight } from 'lucide-react';

const WeeklyQuiz: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-lg p-8 border-l-8 border-brand-accent">
          <div className="flex items-start gap-6 mb-6 md:mb-0">
            <div className="bg-brand-dark p-4 rounded-xl text-brand-accent hidden sm:block">
              <BrainCircuit size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-dark mb-2">Do not forget</h3>
              <p className="text-gray-600 max-w-lg">
                We are the eyes of modern medicine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeeklyQuiz;