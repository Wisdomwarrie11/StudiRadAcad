import React from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-brand-dark">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="mri.jpeg" 
          alt="Radiography Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/30 border border-brand-primary/50 text-brand-light text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
            </span>
            Now offering AI in Radiology courses
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Transform Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-yellow-200">
              Radiography
            </span> Journey
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light leading-relaxed max-w-2xl">
            Join the premier community for radiographers. Access expert-led classes, exclusive job listings, and mentorship—anytime, anywhere.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-brand-accent text-brand-dark font-bold text-lg rounded-xl hover:bg-white hover:scale-105 transition-all shadow-lg shadow-brand-accent/20 flex items-center justify-center gap-2">
              Explore Courses <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-white/10 text-white font-semibold text-lg rounded-xl hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all flex items-center justify-center gap-2">
              <PlayCircle size={20} />
              How It Works
            </button>
          </div>

          <div style={{marginBottom: "20px"}} className="mt-12 flex items-center gap-4 text-gray-400 text-sm">
            <p>Trusted by over <span className="text-white font-bold">2,000+</span> Radiographers</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;